
CREATE DATABASE [RASTimeSheets]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'RASTimeSheets', FILENAME = N'D:\SQL-Data\Data\RASTimeSheets.mdf' , SIZE = 310976KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'RASTimeSheets_log', FILENAME = N'D:\SQL-Data\Data\RASTimeSheets_log.ldf' , SIZE = 29952KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [RASTimeSheets] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [RASTimeSheets].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [RASTimeSheets] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [RASTimeSheets] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [RASTimeSheets] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [RASTimeSheets] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [RASTimeSheets] SET ARITHABORT OFF 
GO
ALTER DATABASE [RASTimeSheets] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [RASTimeSheets] SET AUTO_CREATE_STATISTICS ON 
GO
ALTER DATABASE [RASTimeSheets] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [RASTimeSheets] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [RASTimeSheets] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [RASTimeSheets] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [RASTimeSheets] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [RASTimeSheets] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [RASTimeSheets] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [RASTimeSheets] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [RASTimeSheets] SET  ENABLE_BROKER 
GO
ALTER DATABASE [RASTimeSheets] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [RASTimeSheets] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [RASTimeSheets] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [RASTimeSheets] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [RASTimeSheets] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [RASTimeSheets] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [RASTimeSheets] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [RASTimeSheets] SET RECOVERY FULL 
GO
ALTER DATABASE [RASTimeSheets] SET  MULTI_USER 
GO
ALTER DATABASE [RASTimeSheets] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [RASTimeSheets] SET DB_CHAINING OFF 
GO
ALTER DATABASE [RASTimeSheets] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [RASTimeSheets] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
EXEC sys.sp_db_vardecimal_storage_format N'RASTimeSheets', N'ON'
GO
USE [RASTimeSheets]
GO



/****** Object:  StoredProcedure [dbo].[spFoundConfirmTimeSheet]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		A.Aghajani
-- Create date: 1399/09/26
-- Description:	Found confirm timesheet for wanted user
-- =============================================
CREATE PROCEDURE [dbo].[spFoundConfirmTimeSheet] 
	-- Add the parameters for the stored procedure here
	@approver_userId uniqueidentifier,
	@userId uniqueidentifier,
	@startDate datetime,
	@endDate datetime,
	@onlyWantSumOfAllWaitingForApproveTime bit=0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	declare @isManager bit;
	select @isManager=1 from OrganizationUnits where ManagerID=@approver_userId
	and ID in
	(
	select OrganizationUnitID from Users where ID=@userId
	)

if @onlyWantSumOfAllWaitingForApproveTime=0 
begin

	declare @today datetime;
	set @today = CAST(getdate() as date);

	select b.Type, t.TimeByDay Date,t.PersianDate,t.TimeDayOfTheWeek DayOfWeek, p.Minutes Hozoor 
	,b.ProjectId,b.ProjectTitle,b.TaskId,b.Title,b.Minutes,b.State,
	cast(case when t.TimeByDay>@today then 0 when  isnull(p.IsFriday,0)=1 then 0 else tpolicy.IsOpen end as bit) IsOpen,
	 p.DayTimeString, null UserMustHasHozoor
	from
	(select * from tbl_TimeByDay where TimeByDay>=@startDate and TimeByDay<=@endDate) t
	left join [tsm].[PresenceHours] p on p.[Date]=t.TimeByDay and p.EmployeeID=@userId
	left join
	(
		select 'Work' Type, t.ID TaskId,a.Date,a.ProjectId,p.Title ProjectTitle,sum(a.Minutes) Minutes,t.Title ,
		case when (b.Type='Manager' and @isManager=1)
		or (b.Type='ProjectManager' and p.OwnerID=@approver_userId) then N'TaskNotApprove' 
		else b.Title end State
		from tsm.WorkHours a 
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		left join Tasks t on t.ID=a.TaskID
		left join Projects p on p.ID=t.ProjectID
		where EmployeeID=@userId and a.Date>=@startDate and a.Date<=@endDate
		and b.[Order]>1
		group by t.ID,a.Date,a.ProjectId,p.Title,t.Title,case when (b.Type='Manager' and @isManager=1)
		or (b.Type='ProjectManager' and p.OwnerID=@approver_userId) then N'TaskNotApprove' 
		else b.Title end

		union

		select 'Other' Type, '00000000-0000-0000-0000-000000000001' TaskId,Date
				,case when (b.Type='Manager' and @isManager=1) then N'00000000-0000-0000-1111-000000000000' 
				else '00000000-0000-0000-2222-000000000000' end ProjectId, 'HourlyMission' ProjectTitle
			,Minutes, N'ماموریت ساعتی' Title
			,case when (b.Type='Manager' and @isManager=1) then N'TaskNotApprove' 
				else N'Approved' end State
		from HourlyMissions a
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		where UserID=@userId and a.Date>=@startDate and a.Date<=@endDate and b.[Order]>1

		union

		select 'Other' Type, '00000000-0000-0000-0000-000000000002' TaskId,cast([From] as date) Date,
			case when (b.Type='Manager' and @isManager=1) then N'00000000-0000-0000-1111-000000000000' 
				else '00000000-0000-0000-2222-000000000000' end ProjectId,'HourlyLeave' ProjectTitle
			,DATEDIFF(MINUTE, [From],[To]) Minutes,N'مرخصی ساعتی' Title
			,case when (b.Type='Manager' and @isManager=1) then N'TaskNotApprove' 
				else N'Approved' end State
		from HourlyLeaves a
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		where UserID=@userId and cast([From] as date)>=@startDate and cast([From] as date)<=@endDate and b.[Order]>1

		union

		select 'Other' Type, '00000000-0000-0000-0000-000000000003' TaskId,t.TimeByDay Date,
			case when (b.Type='Manager' and @isManager=1) then N'00000000-0000-0000-1111-000000000000' 
				else '00000000-0000-0000-2222-000000000000' end ProjectId,'DailyLeave' ProjectTitle,480 Minutes,N'مرخصی روزانه' Title
			,case when (b.Type='Manager' and @isManager=1) then N'TaskNotApprove' 
				else N'Approved' end State
		from DailyLeaves a
		left join tbl_TimeByDay t on t.TimeByDay>=a.[From] and t.TimeByDay<=a.[To]
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		where UserID=@userId and t.TimeByDay>=@startDate and t.TimeByDay<=@endDate and b.[Order]>1

	) b on t.TimeByDay=b.Date
	left join fnGetUserTimesheetPolicy(@approver_userId,@startDate,@endDate) tpolicy on tpolicy.TimeByDay=t.TimeByDay
	order by t.TimeByDay, b.Title
end ELSE
BEGIN

declare @minutes int,@minutes_hourlyMission int,@minutes_hourlyLeave int,@minutes_dailyLeave int;

		select @minutes = sum(a.Minutes) 
		from tsm.WorkHours a 
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		left join Tasks t on t.ID=a.TaskID
		left join Projects p on p.ID=t.ProjectID
		left join (
			select ID from Projects where OwnerID=@approver_userId
		) projectManager on projectManager.ID=p.ID
		left join (
			select ID from Users where OrganizationUnitID in
			(
				select ID from OrganizationUnits where ManagerID=@approver_userId
			)
		) manager on manager.ID = a.EmployeeID
		where  (b.Type='Manager' and manager.ID is not null ) or (b.Type='ProjectManager' and projectManager.ID is not null)


		select @minutes_hourlyMission=SUM(a.Minutes)
		from HourlyMissions a
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		left join (
			select ID from Users where OrganizationUnitID in
			(
				select ID from OrganizationUnits where ManagerID=@approver_userId
			)
		) manager on manager.ID = a.UserID
		where (b.Type='Manager' and manager.ID is not null )


		select @minutes_hourlyLeave = sum(DATEDIFF(MINUTE,a.[From],a.[To]))
		from HourlyLeaves a
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		left join (
			select ID from Users where OrganizationUnitID in
			(
				select ID from OrganizationUnits where ManagerID=@approver_userId
			)
		) manager on manager.ID = a.UserID
		where (b.Type='Manager' and manager.ID is not null )


		select @minutes_dailyLeave =  sum(DATEDIFF(MINUTE,a.[From],a.[To]))
		from DailyLeaves a
		left join tbl_TimeByDay t on t.TimeByDay>=a.[From] and t.TimeByDay<=a.[To]
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		left join (
			select ID from Users where OrganizationUnitID in
			(
				select ID from OrganizationUnits where ManagerID=@approver_userId
			)
		) manager on manager.ID = a.UserID
		where (b.Type='Manager' and manager.ID is not null )

	select * from
	(
		select '0work' Type, null Date, null PersianDate,null DayOfWeek, null Hozoor 
		,null ProjectId, null ProjectTitle, null TaskId, null Title, @minutes Minutes, null State, null IsOpen, null DayTimeString, null UserMustHasHozoor
	
		union
	
		select '1hourlyMission' Type, null Date, null PersianDate,null DayOfWeek, null Hozoor 
		,null ProjectId, null ProjectTitle, null TaskId, null Title, @minutes_hourlyMission Minutes, null State, null IsOpen, null DayTimeString, null UserMustHasHozoor
	
		union
	
		select '2hourlyLeave' Type, null Date, null PersianDate,null DayOfWeek, null Hozoor 
		,null ProjectId, null ProjectTitle, null TaskId, null Title, @minutes_hourlyLeave Minutes, null State, null IsOpen, null DayTimeString, null UserMustHasHozoor
	
		union
	
		select '3dailyLeave' Type, null Date, null PersianDate,null DayOfWeek, null Hozoor 
		,null ProjectId, null ProjectTitle, null TaskId, null Title, @minutes_dailyLeave Minutes, null State, null IsOpen, null DayTimeString, null UserMustHasHozoor
	) a order by Type
end


END


select DATEDIFF(MINUTE,'2012-01-01 11:00','2012-01-01 11:01')
GO
/****** Object:  StoredProcedure [dbo].[spFoundEmployeeTimeSheet]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		A.Aghajani
-- Create date: 1399/09/26
-- Description:	Found confirm timesheet for wanted user
-- =============================================
CREATE PROCEDURE [dbo].[spFoundEmployeeTimeSheet] 
	-- Add the parameters for the stored procedure here
	@userId uniqueidentifier,
	@startDate datetime,
	@endDate datetime
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	declare @today datetime;
	set @today = CAST(getdate() as date);

	declare @timeSheetLock datetime;
	select top 1 @timeSheetLock=  TimeSheetLockDate from TimeSheetConfig 

	select isnull(b.Type,'Work') Type, t.TimeByDay Date,t.PersianDate,t.TimeDayOfTheWeek DayOfWeek, p.Minutes Hozoor 
	,b.ProjectId,b.ProjectTitle,b.TaskId,b.Title,b.Minutes,b.State 
	,cast(case when t.TimeByDay<@timeSheetLock then 0 
			when t.TimeByDay>@today then 0 
			--when  isnull(p.IsFriday,0)=1 then 0 
			else tpolicy.IsOpen end as bit) IsOpen
	,p.DayTimeString, tpolicy.UserMustHasHozoor
	from
	(select cast(TimeByDay as date) TimeByDay,PersianDate,TimeDayOfTheWeek 
	from tbl_TimeByDay where TimeByDay>=@startDate and TimeByDay<=@endDate) t
	left join [tsm].[PresenceHours] p on p.[Date]=t.TimeByDay and p.EmployeeID=@userId
	left join
	(
		select 'Work' Type, t.ID TaskId,a.Date,a.ProjectId,p.Title ProjectTitle,sum(a.Minutes) Minutes,t.Title ,
		case when b.Type='Manager' or b.Type='ProjectManager' then 'Approving'
			when b.Type='Resource' and a.PreviousStage <>a.WorkflowStageID then 'Denied' else b.Type  end    State
		from tsm.WorkHours a 
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		left join Tasks t on t.ID=a.TaskID
		left join Projects p on p.ID=t.ProjectID
		where EmployeeID=@userId and a.Date>=@startDate and a.Date<=@endDate
		group by t.ID,a.Date,a.ProjectId,p.Title,t.Title, 
		case when b.Type='Manager' or b.Type='ProjectManager' then 'Approving' 
			when b.Type='Resource' and a.PreviousStage <>a.WorkflowStageID then 'Denied' else b.Type  end

		union all

		select 'Other' Type, '00000000-0000-0000-0000-000000000001' TaskId,Date,
			case when b.Type='Manager' or b.Type='ProjectManager' then '00000000-0000-0000-1111-000000000000' 
			when b.Type='Resource' and a.PreviousStage <>a.WorkflowStageID then '00000000-0000-0000-2222-000000000000'
			when b.Type='Resource' then '00000000-0000-0000-3333-000000000000'
			when b.Type='Final' then '00000000-0000-0000-4444-000000000000'  end ProjectId
			, 'HourlyMission' ProjectTitle
			,Minutes, N'ماموریت ساعتی' Title
			,case when b.Type='Manager' or b.Type='ProjectManager' then N'در حال تایید' 
			when b.Type='Resource' and a.PreviousStage <>a.WorkflowStageID then N'رد شده'
			when b.Type='Resource' then N'ارسال نشده'
			when b.Type='Final' then N'تایید شده'  end    State
		from HourlyMissions a
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		where UserID=@userId and a.Date>=@startDate and a.Date<=@endDate

		union all

		select 'Other' Type, '00000000-0000-0000-0000-000000000002' TaskId,cast([From] as date) Date,
			case when b.Type='Manager' or b.Type='ProjectManager' then '00000000-0000-0000-1111-000000000000' 
			when b.Type='Resource' and a.PreviousStage <>a.WorkflowStageID then '00000000-0000-0000-2222-000000000000'
			when b.Type='Resource' then '00000000-0000-0000-3333-000000000000'
			when b.Type='Final' then '00000000-0000-0000-4444-000000000000'  end ProjectId
			,'HourlyLeave' ProjectTitle
			,DATEDIFF(MINUTE, [From],[To]) Minutes,N'مرخصی ساعتی' Title
			,case when b.Type='Manager' or b.Type='ProjectManager' then N'در حال تایید' 
			when b.Type='Resource' and a.PreviousStage <>a.WorkflowStageID then N'رد شده'
			when b.Type='Resource' then N'ارسال نشده'
			when b.Type='Final' then N'تایید شده'  end    State
		from HourlyLeaves a
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		where UserID=@userId and cast([From] as date)>=@startDate and cast([From] as date)<=@endDate

		union all

		select 'Other' Type, '00000000-0000-0000-0000-000000000003' TaskId,t.TimeByDay Date,
			case when b.Type='Manager' or b.Type='ProjectManager' then '00000000-0000-0000-1111-000000000000' 
			when b.Type='Resource' and a.PreviousStage <>a.WorkflowStageID then '00000000-0000-0000-2222-000000000000'
			when b.Type='Resource' then '00000000-0000-0000-3333-000000000000'
			when b.Type='Final' then '00000000-0000-0000-4444-000000000000'  end ProjectId
			,'DailyLeave' ProjectTitle,480 Minutes,N'مرخصی روزانه' Title
			,case when b.Type='Manager' or b.Type='ProjectManager' then N'در حال تایید' 
			when b.Type='Resource' and a.PreviousStage <>a.WorkflowStageID then N'رد شده'
			when b.Type='Resource' then N'ارسال نشده'
			when b.Type='Final' then N'تایید شده'  end    State
		from DailyLeaves a
		left join tbl_TimeByDay t on t.TimeByDay>=a.[From] and t.TimeByDay<=a.[To]
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		where UserID=@userId and t.TimeByDay>=@startDate and t.TimeByDay<=@endDate

	) b on t.TimeByDay=b.Date
	left join fnGetUserTimesheetPolicy(@userId,@startDate,@endDate) tpolicy on tpolicy.TimeByDay=t.TimeByDay
	order by t.TimeByDay, b.Title

END

GO
/****** Object:  StoredProcedure [dbo].[spGetSubUsers]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		A.Aghajani
-- Create date: 1399/12/10
-- Description:	کاربران زیرمجموعه یک فرد
-- =============================================
CREATE PROCEDURE [dbo].[spGetSubUsers] 
	-- Add the parameters for the stored procedure here
	@approver_userId uniqueidentifier
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select a.UserId,UserTitle,Minutes, Minutes_Leave_Mission from
	(
		select u.ID UserId,u.UserTitle 
		from Projects p 
		left join Tasks t on p.OwnerID = @approver_userId and p.ID=t.ProjectID
		left join Assignments a on a.TaskID = t.ID
		left join Users u on u.ID=a.ResourceID
		where u.ID is not null
		group by u.ID ,u.UserTitle
		union
		select u.ID UserId,u.UserTitle from OrganizationUnits o
			left join Users u on o.ManagerID=@approver_userId and u.OrganizationUnitID=o.ID 
			where u.ID is not null
		group by u.ID ,u.UserTitle
	) a left join
	(
		select  a.EmployeeID, sum(a.Minutes) Minutes
		from tsm.WorkHours a 
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		left join Tasks t on t.ID=a.TaskID
		left join Projects p on p.ID=t.ProjectID
		left join (
			select ID from Projects where OwnerID=@approver_userId
		) projectManager on projectManager.ID=p.ID
		left join (
			select ID from Users where OrganizationUnitID in
			(
				select ID from OrganizationUnits where ManagerID=@approver_userId
			)
		) manager on manager.ID = a.EmployeeID
		where  (b.Type='Manager' and manager.ID is not null ) or (b.Type='ProjectManager' and projectManager.ID is not null)
		group by a.EmployeeID
	) b on a.UserId=b.EmployeeID
	left join
	(
		select UserID,sum(Minutes)  Minutes_Leave_Mission
		from (
			select a.UserID, SUM(a.Minutes) Minutes
			from HourlyMissions a
			left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
			left join (
				select ID from Users where OrganizationUnitID in
				(
					select ID from OrganizationUnits where ManagerID=@approver_userId
				)
			) manager on manager.ID = a.UserID
			where (b.Type='Manager' and manager.ID is not null )
			group by a.UserID

			union all

			select a.UserId,sum(DATEDIFF(MINUTE,a.[From],a.[To]))
			from HourlyLeaves a
			left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
			left join (
				select ID from Users where OrganizationUnitID in
				(
					select ID from OrganizationUnits where ManagerID=@approver_userId
				)
			) manager on manager.ID = a.UserID
			where (b.Type='Manager' and manager.ID is not null )
			group by a.UserId

			union all

			select a.UserId, sum(DATEDIFF(MINUTE,a.[From],a.[To]))
			from DailyLeaves a
			left join tbl_TimeByDay t on t.TimeByDay>=a.[From] and t.TimeByDay<=a.[To]
			left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
			left join (
				select ID from Users where OrganizationUnitID in
				(
					select ID from OrganizationUnits where ManagerID=@approver_userId
				)
			) manager on manager.ID = a.UserID
			where (b.Type='Manager' and manager.ID is not null )
			group by a.UserId
		) aa
		group by UserID

	) c on a.UserId = c.UserID
	order by Minutes desc,UserTitle
END

GO
/****** Object:  StoredProcedure [dbo].[spWaitingForApproveLeaveMissionDetail]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		A.Aghajani
-- Create date: 1399/11/15
-- Description:	Found confirm leave mission detail for wanted user
-- =============================================
CREATE PROCEDURE [dbo].[spWaitingForApproveLeaveMissionDetail] 
	@type int,
	@approver_userId uniqueidentifier,
	@userId uniqueidentifier,
	@startDate datetime,
	@endDate datetime
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	declare @isManager bit;
	select @isManager=1 from OrganizationUnits where ManagerID=@approver_userId
	and ID in
	(
	select OrganizationUnitID from Users where ID=@userId
	)

	if @type=1 begin
		select a.ID Id, a.[From],a.[To]
		,cast(case when bb.[Order]>b.[Order] then 0 else 1 end as bit) IsSend,'' Description
		,t1.PersianDate FromPersianDate,t1.TimeDayOfTheWeek FromTimeDayOfTheWeek
		,t2.PersianDate ToPersianDate,t2.TimeDayOfTheWeek ToTimeDayOfTheWeek
		from HourlyMissions a
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		left join tsm.WorkflowStages bb on a.PreviousStage=bb.ID
		left join tbl_TimeByDay t1 on t1.TimeByDay = cast(a.[From] as date)
		left join tbl_TimeByDay t2 on t2.TimeByDay = cast(a.[To] as date)
		where UserID=@userId and a.Date>=@startDate and a.Date<=@endDate and b.[Order]>1
			and case when (b.Type='Manager' and @isManager=1) then 'TaskNotApprove' 
				else 'Approved' end = 'TaskNotApprove'
		order by a.Date
	end


	if @type=2 begin
		select a.ID Id, a.[From],a.[To]
		,cast(case when bb.[Order]>b.[Order] then 0 else 1 end as bit) IsSend,'' Description
		,t1.PersianDate FromPersianDate,t1.TimeDayOfTheWeek FromTimeDayOfTheWeek
		,t2.PersianDate ToPersianDate,t2.TimeDayOfTheWeek ToTimeDayOfTheWeek
		from HourlyLeaves a
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		left join tsm.WorkflowStages bb on a.PreviousStage=bb.ID
		left join tbl_TimeByDay t1 on t1.TimeByDay = cast(a.[From] as date)
		left join tbl_TimeByDay t2 on t2.TimeByDay = cast(a.[To] as date)
		where UserID=@userId and cast([From] as date)>=@startDate and cast([From] as date)<=@endDate and b.[Order]>1
			and case when (b.Type='Manager' and @isManager=1) then 'TaskNotApprove' 
				else 'Approved' end = 'TaskNotApprove'
		order by a.[From]

	end


	if @type=3 begin
		--مرخصی روزانه، استارتش در بازه باشه
		select a.ID Id, a.[From],a.[To]
		,cast(case when bb.[Order]>b.[Order] then 0 else 1 end as bit) IsSend,'' Description
		,t1.PersianDate FromPersianDate,t1.TimeDayOfTheWeek FromTimeDayOfTheWeek
		,t2.PersianDate ToPersianDate,t2.TimeDayOfTheWeek ToTimeDayOfTheWeek
		from DailyLeaves a
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		left join tsm.WorkflowStages bb on a.PreviousStage=bb.ID
		left join tbl_TimeByDay t1 on t1.TimeByDay = cast(a.[From] as date)
		left join tbl_TimeByDay t2 on t2.TimeByDay = cast(a.[To] as date)
		where UserID=@userId and cast([From] as date)>=@startDate and cast([From] as date)<=@endDate and b.[Order]>1
			and case when (b.Type='Manager' and @isManager=1) then 'TaskNotApprove' 
				else 'Approved' end = 'TaskNotApprove'
		order by a.[From]
	end

END


GO
/****** Object:  StoredProcedure [dbo].[spWaitingForApproveWorkHourDetail]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		A.Aghajani
-- Create date: 1399/11/09
-- Description:	Found confirm timesheet detail for wanted user
-- =============================================
CREATE PROCEDURE [dbo].[spWaitingForApproveWorkHourDetail] 
	-- Add the parameters for the stored procedure here
	@approver_userId uniqueidentifier,
	@userId uniqueidentifier,
	@startDate datetime,
	@endDate datetime,
	@projectId uniqueidentifier,
	@taskId uniqueidentifier
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	declare @isManager bit;
	select @isManager=1 from OrganizationUnits where ManagerID=@approver_userId
	and ID in
	(
	select OrganizationUnitID from Users where ID=@userId
	)


	select a.ID WorkHourId,a.Date,a.ProjectId,p.Title ProjectTitle,a.Minutes ,t.Title,
		case when a.Description='' then Null else a.Description end Description,
		cast(case when bb.[Order]>b.[Order] then 0 else 1 end as bit) IsSend,
		tt.PersianDate,tt.TimeDayOfTheWeek
		from tsm.WorkHours a 
		left join tbl_TimeByDay tt on tt.TimeByDay=a.Date
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		left join tsm.WorkflowStages bb on a.PreviousStage=bb.ID
		left join Tasks t on t.ID=a.TaskID
		left join Projects p on p.ID=t.ProjectID
		where EmployeeID=@userId and a.Date>=@startDate and a.Date<=@endDate
		and (@projectId is null or p.ID=@projectId) 
		and (@taskId is null or a.TaskID=@taskId)
		and b.[Order]>1
		and case when (b.Type='Manager' and @isManager=1)
		or (b.Type='ProjectManager' and p.OwnerID=@approver_userId) then 'TaskNotApprove' 
		else b.Title end = 'TaskNotApprove'
		order by a.Date,ProjectTitle,t.Title
	
END


GO
/****** Object:  UserDefinedFunction [dbo].[fnGetUserTimesheetPolicy]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		A.Aghajani
-- Create date: 1399/11/23
-- Description:	found user timesheet policy
-- =============================================
create FUNCTION [dbo].[fnGetUserTimesheetPolicy] 
(
	-- Add the parameters for the function here
	@userId uniqueidentifier,
	@start date,
	@finish date
)
RETURNS 
@Table_Var TABLE 
(
	-- Add the column definitions for the TABLE variable here
	TimeByDay date,
	UserId uniqueidentifier,
	IsOpen bit,
	UserMustHasHozoor bit
)
AS
BEGIN
	
	insert into @Table_Var(TimeByDay,UserId,IsOpen,UserMustHasHozoor)
	select TimeByDay,UserId,IsOpen,UserMustHasHozoor from
	(
		select ROW_NUMBER() over (partition by t.timebyday order by isdefault, createDate desc) R, t.TimeByDay,a.*
		 from TimesheetPolicies a
		left join (select * from tbl_TimeByDay where TimeByDay>=@start and TimeByDay<=@finish) t 
		on t.TimeByDay>=a.Start and t.TimeByDay<=a.Finish
		where UserId=@userId and Validity>=cast(GETDATE() as date) and isDeactivated=0
		and not (Start>@finish or Finish<@start)
	) a where R=1

order by IsDefault
	
	RETURN 
END

GO
/****** Object:  Table [dbo].[__MigrationHistory]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[__MigrationHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ContextKey] [nvarchar](300) NOT NULL,
	[Model] [varbinary](max) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK_dbo.__MigrationHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC,
	[ContextKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Assignments]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Assignments](
	[ID] [uniqueidentifier] NOT NULL,
	[ProjectID] [uniqueidentifier] NULL,
	[TaskID] [uniqueidentifier] NOT NULL,
	[ResourceID] [uniqueidentifier] NOT NULL,
	[IsDeactivated] [bit] NULL,
 CONSTRAINT [PK_dbo.Assignments] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DailyLeaves]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DailyLeaves](
	[ID] [uniqueidentifier] NOT NULL,
	[RegisterDate] [datetime] NOT NULL,
	[From] [datetime2](7) NOT NULL,
	[To] [datetime2](7) NOT NULL,
	[UserID] [uniqueidentifier] NOT NULL,
	[SuccessorID] [uniqueidentifier] NULL,
	[ProjectID] [uniqueidentifier] NULL,
	[Type] [int] NOT NULL,
	[WorkflowStageID] [uniqueidentifier] NOT NULL,
	[PreviousStage] [uniqueidentifier] NOT NULL,
	[User_ID] [uniqueidentifier] NULL,
	[OrganisationId] [uniqueidentifier] NULL,
 CONSTRAINT [PK_dbo.DailyLeaves] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[HourlyLeaves]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HourlyLeaves](
	[ID] [uniqueidentifier] NOT NULL,
	[RegisterDate] [datetime] NOT NULL,
	[LeaveDate] [datetime2](7) NOT NULL,
	[ProjectID] [uniqueidentifier] NULL,
	[From] [datetime2](7) NOT NULL,
	[To] [datetime2](7) NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[WorkflowStageID] [uniqueidentifier] NOT NULL,
	[PreviousStage] [uniqueidentifier] NOT NULL,
	[OrganisationId] [uniqueidentifier] NULL,
 CONSTRAINT [PK_dbo.HourlyLeaves] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[HourlyMissions]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HourlyMissions](
	[ID] [uniqueidentifier] NOT NULL,
	[RegisterDate] [datetime] NOT NULL,
	[From] [datetime2](7) NOT NULL,
	[To] [datetime2](7) NOT NULL,
	[UserID] [uniqueidentifier] NOT NULL,
	[ProjectID] [uniqueidentifier] NULL,
	[WorkflowStageID] [uniqueidentifier] NOT NULL,
	[PreviousStage] [uniqueidentifier] NOT NULL,
	[Date] [datetime2](7) NOT NULL CONSTRAINT [DF__HourlyMiss__Date__49C3F6B7]  DEFAULT ('1900-01-01T00:00:00.000'),
	[OrganisationId] [uniqueidentifier] NULL,
	[Minutes] [int] NOT NULL CONSTRAINT [DF__HourlyMis__Hours__5165187F]  DEFAULT ((0)),
	[Location] [nvarchar](500) NULL,
	[subject] [nvarchar](500) NULL,
 CONSTRAINT [PK_dbo.HourlyMissions] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Moadel_Main]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Moadel_Main](
	[ProjectUID] [uniqueidentifier] NOT NULL,
	[ProjectTitle] [nvarchar](255) NULL,
	[TaskUID] [uniqueidentifier] NOT NULL,
	[TaskName] [nvarchar](255) NULL,
	[TaskWBS] [nvarchar](max) NULL,
	[AssignmentUID] [uniqueidentifier] NULL,
	[Duration] [float] NULL,
	[SheetStatusId] [smallint] NOT NULL,
	[Date] [datetime] NOT NULL,
	[ResourceNTAccount] [nvarchar](255) NULL,
	[codePersoneli] [int] NULL,
	[Resourceuid] [varchar](36) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Moadel_Projects]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Moadel_Projects](
	[ProjectUID_Per] [uniqueidentifier] NOT NULL,
	[ProjectUID] [uniqueidentifier] NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Moadel_Task]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Moadel_Task](
	[ProjectUID] [uniqueidentifier] NOT NULL,
	[TaskUID_Per] [uniqueidentifier] NOT NULL,
	[TaskName] [nvarchar](255) NULL,
	[TaskWBS_Per] [nvarchar](max) NULL,
	[TaskUID] [uniqueidentifier] NULL,
	[TaskWBS] [nvarchar](max) NULL,
	[IsMultiple] [bit] NULL,
	[Problem] [nvarchar](500) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[OrganizationUnits]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrganizationUnits](
	[ID] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](max) NULL,
	[ParentID] [uniqueidentifier] NULL,
	[ManagerID] [uniqueidentifier] NULL,
 CONSTRAINT [PK_dbo.OrganizationUnits] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Projects]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Projects](
	[ID] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](max) NULL,
	[OwnerID] [uniqueidentifier] NULL,
	[CalendarID] [uniqueidentifier] NULL,
 CONSTRAINT [PK_dbo.Projects] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Tasks]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tasks](
	[ID] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](max) NULL,
	[ProjectID] [uniqueidentifier] NULL,
	[ParentTaskID] [uniqueidentifier] NULL,
 CONSTRAINT [PK_dbo.Tasks] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tbl_TimeByDay]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_TimeByDay](
	[TimeByDay] [datetime] NOT NULL,
	[TimeDayOfTheWeek] [tinyint] NULL,
	[TimeMonthOfTheYear] [tinyint] NULL,
	[TimeYear] [smallint] NULL,
	[TimeDayOfTheMonth] [tinyint] NULL,
	[TimeWeekOfTheYear] [tinyint] NULL,
	[TimeQuarter] [tinyint] NULL,
	[FiscalYear] [int] NULL,
	[FiscalQuarter] [int] NULL,
	[PersianDate] [nchar](10) NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[TimeSheetConfig]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TimeSheetConfig](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TimeSheetLockDate] [datetime] NULL,
	[DefualtOpenTimeSheetWeeks] [int] NULL,
 CONSTRAINT [PK_TimeSheetConfig] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[TimesheetPolicies]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TimesheetPolicies](
	[Id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_TimesheetPolicies_Id]  DEFAULT (newid()),
	[isDeactivated] [bit] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_TimesheetPolicies_CreateDate]  DEFAULT (getdate()),
	[Start] [datetime] NOT NULL,
	[Finish] [datetime] NOT NULL,
	[Validity] [datetime] NOT NULL,
	[IsDefault] [bit] NOT NULL,
	[IsOpen] [bit] NOT NULL,
	[UserMustHasHozoor] [bit] NOT NULL,
 CONSTRAINT [PK_TimesheetPolicies] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Users]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[ID] [uniqueidentifier] NOT NULL,
	[IsAdmin] [bit] NULL,
	[Code] [nvarchar](50) NULL,
	[UserTitle] [nvarchar](max) NULL,
	[UserName] [nvarchar](max) NULL,
	[OrganizationUnitID] [uniqueidentifier] NULL,
 CONSTRAINT [PK_dbo.Users] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [tsm].[Calendars]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [tsm].[Calendars](
	[ID] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](max) NOT NULL,
	[IsSaturdayWD] [bit] NULL,
	[IsSundayWD] [bit] NULL,
	[IsMondayWD] [bit] NULL,
	[IsTuesdayWD] [bit] NULL,
	[IsWednesdayWD] [bit] NULL,
	[IsThursdayWD] [bit] NULL,
	[IsFridayWD] [bit] NULL,
 CONSTRAINT [PK_tsm.Calendars] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [tsm].[DisplayPeriods]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [tsm].[DisplayPeriods](
	[ID] [uniqueidentifier] NOT NULL,
	[StartDate] [datetime] NOT NULL,
	[IsWeekly] [bit] NOT NULL,
	[NumOfDays] [int] NOT NULL,
	[EmployeeID] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_tsm.DisplayPeriods] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [tsm].[Holidays]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [tsm].[Holidays](
	[ID] [uniqueidentifier] NOT NULL,
	[Date] [datetime] NOT NULL,
	[CalendarID] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_tsm.Holidays] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [tsm].[PresenceHours]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [tsm].[PresenceHours](
	[ID] [uniqueidentifier] NOT NULL,
	[Date] [datetime] NOT NULL,
	[EmployeeID] [uniqueidentifier] NOT NULL,
	[Minutes] [int] NOT NULL,
	[InTime] [nvarchar](max) NULL,
	[OutTime] [nvarchar](max) NULL,
	[DateName] [nvarchar](max) NULL,
	[IsFriday] [bit] NULL,
	[IsOffWork] [int] NULL,
	[DayTimeString] [nvarchar](max) NULL,
 CONSTRAINT [PK_tsm.PresenceHours] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [tsm].[WorkflowStages]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [tsm].[WorkflowStages](
	[ID] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](max) NULL,
	[Order] [int] NOT NULL,
	[Type] [nvarchar](max) NULL,
	[IsFirst] [bit] NOT NULL,
	[IsLast] [bit] NOT NULL,
 CONSTRAINT [PK_tsm.WorkflowStages] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [tsm].[WorkHourHistories]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [tsm].[WorkHourHistories](
	[ID] [uniqueidentifier] NOT NULL,
	[EntityId] [uniqueidentifier] NULL,
	[StageID] [uniqueidentifier] NULL,
	[Action] [nvarchar](max) NULL,
	[ManagerID] [uniqueidentifier] NULL,
	[Description] [nvarchar](max) NULL,
	[Date] [datetime2](7) NOT NULL,
	[UserDescription] [nvarchar](max) NULL,
 CONSTRAINT [PK_tsm.WorkHourHistories] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [tsm].[WorkHours]    Script Date: 9/18/2022 11:00:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [tsm].[WorkHours](
	[ID] [uniqueidentifier] NOT NULL,
	[Date] [datetime] NOT NULL,
	[EmployeeID] [uniqueidentifier] NOT NULL,
	[TaskID] [uniqueidentifier] NOT NULL,
	[ProjectId] [uniqueidentifier] NOT NULL,
	[Minutes] [int] NOT NULL,
	[WorkflowStageID] [uniqueidentifier] NOT NULL,
	[Description] [nvarchar](max) NULL,
	[Action] [nvarchar](max) NULL,
	[PreviousStage] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_tsm.WorkHours] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Index [IX_ResourceID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_ResourceID] ON [dbo].[Assignments]
(
	[ResourceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_TaskID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_TaskID] ON [dbo].[Assignments]
(
	[TaskID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_OrganisationId]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_OrganisationId] ON [dbo].[DailyLeaves]
(
	[OrganisationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ProjectID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_ProjectID] ON [dbo].[DailyLeaves]
(
	[ProjectID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_SuccessorID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_SuccessorID] ON [dbo].[DailyLeaves]
(
	[SuccessorID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_User_ID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_User_ID] ON [dbo].[DailyLeaves]
(
	[User_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_UserID] ON [dbo].[DailyLeaves]
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_WorkflowStageID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_WorkflowStageID] ON [dbo].[DailyLeaves]
(
	[WorkflowStageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_OrganisationId]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_OrganisationId] ON [dbo].[HourlyLeaves]
(
	[OrganisationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ProjectID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_ProjectID] ON [dbo].[HourlyLeaves]
(
	[ProjectID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserId]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[HourlyLeaves]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_WorkflowStageID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_WorkflowStageID] ON [dbo].[HourlyLeaves]
(
	[WorkflowStageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_OrganisationId]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_OrganisationId] ON [dbo].[HourlyMissions]
(
	[OrganisationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ProjectID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_ProjectID] ON [dbo].[HourlyMissions]
(
	[ProjectID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_UserID] ON [dbo].[HourlyMissions]
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_WorkflowStageID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_WorkflowStageID] ON [dbo].[HourlyMissions]
(
	[WorkflowStageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ManagerID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_ManagerID] ON [dbo].[OrganizationUnits]
(
	[ManagerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_CalendarID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_CalendarID] ON [dbo].[Projects]
(
	[CalendarID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_OwnerID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_OwnerID] ON [dbo].[Projects]
(
	[OwnerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ParentTaskID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_ParentTaskID] ON [dbo].[Tasks]
(
	[ParentTaskID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ProjectID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_ProjectID] ON [dbo].[Tasks]
(
	[ProjectID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_OrganizationUnitID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_OrganizationUnitID] ON [dbo].[Users]
(
	[OrganizationUnitID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_EmployeeID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_EmployeeID] ON [tsm].[DisplayPeriods]
(
	[EmployeeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_CalendarID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_CalendarID] ON [tsm].[Holidays]
(
	[CalendarID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_EmployeeID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_EmployeeID] ON [tsm].[PresenceHours]
(
	[EmployeeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ManagerID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_ManagerID] ON [tsm].[WorkHourHistories]
(
	[ManagerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_StageID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_StageID] ON [tsm].[WorkHourHistories]
(
	[StageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_WorkHourID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_WorkHourID] ON [tsm].[WorkHourHistories]
(
	[EntityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_EmployeeID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_EmployeeID] ON [tsm].[WorkHours]
(
	[EmployeeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ProjectId]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_ProjectId] ON [tsm].[WorkHours]
(
	[ProjectId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_TaskID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_TaskID] ON [tsm].[WorkHours]
(
	[TaskID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_WorkflowStageID]    Script Date: 9/18/2022 11:00:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_WorkflowStageID] ON [tsm].[WorkHours]
(
	[WorkflowStageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Assignments]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Assignments_dbo.Tasks_TaskID] FOREIGN KEY([TaskID])
REFERENCES [dbo].[Tasks] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Assignments] CHECK CONSTRAINT [FK_dbo.Assignments_dbo.Tasks_TaskID]
GO
ALTER TABLE [dbo].[Assignments]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Assignments_dbo.Users_ResourceID] FOREIGN KEY([ResourceID])
REFERENCES [dbo].[Users] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Assignments] CHECK CONSTRAINT [FK_dbo.Assignments_dbo.Users_ResourceID]
GO
ALTER TABLE [dbo].[DailyLeaves]  WITH CHECK ADD  CONSTRAINT [FK_dbo.DailyLeaves_dbo.OrganizationUnits_OrganisationId] FOREIGN KEY([OrganisationId])
REFERENCES [dbo].[OrganizationUnits] ([ID])
GO
ALTER TABLE [dbo].[DailyLeaves] CHECK CONSTRAINT [FK_dbo.DailyLeaves_dbo.OrganizationUnits_OrganisationId]
GO
ALTER TABLE [dbo].[DailyLeaves]  WITH CHECK ADD  CONSTRAINT [FK_dbo.DailyLeaves_dbo.Projects_ProjectID] FOREIGN KEY([ProjectID])
REFERENCES [dbo].[Projects] ([ID])
GO
ALTER TABLE [dbo].[DailyLeaves] CHECK CONSTRAINT [FK_dbo.DailyLeaves_dbo.Projects_ProjectID]
GO
ALTER TABLE [dbo].[DailyLeaves]  WITH CHECK ADD  CONSTRAINT [FK_dbo.DailyLeaves_dbo.Users_SuccessorID] FOREIGN KEY([SuccessorID])
REFERENCES [dbo].[Users] ([ID])
GO
ALTER TABLE [dbo].[DailyLeaves] CHECK CONSTRAINT [FK_dbo.DailyLeaves_dbo.Users_SuccessorID]
GO
ALTER TABLE [dbo].[DailyLeaves]  WITH CHECK ADD  CONSTRAINT [FK_dbo.DailyLeaves_dbo.Users_User_ID] FOREIGN KEY([User_ID])
REFERENCES [dbo].[Users] ([ID])
GO
ALTER TABLE [dbo].[DailyLeaves] CHECK CONSTRAINT [FK_dbo.DailyLeaves_dbo.Users_User_ID]
GO
ALTER TABLE [dbo].[DailyLeaves]  WITH CHECK ADD  CONSTRAINT [FK_dbo.DailyLeaves_dbo.Users_UserID] FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[DailyLeaves] CHECK CONSTRAINT [FK_dbo.DailyLeaves_dbo.Users_UserID]
GO
ALTER TABLE [dbo].[DailyLeaves]  WITH CHECK ADD  CONSTRAINT [FK_dbo.DailyLeaves_tsm.WorkflowStages_WorkflowStageID] FOREIGN KEY([WorkflowStageID])
REFERENCES [tsm].[WorkflowStages] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[DailyLeaves] CHECK CONSTRAINT [FK_dbo.DailyLeaves_tsm.WorkflowStages_WorkflowStageID]
GO
ALTER TABLE [dbo].[HourlyLeaves]  WITH CHECK ADD  CONSTRAINT [FK_dbo.HourlyLeaves_dbo.OrganizationUnits_OrganisationId] FOREIGN KEY([OrganisationId])
REFERENCES [dbo].[OrganizationUnits] ([ID])
GO
ALTER TABLE [dbo].[HourlyLeaves] CHECK CONSTRAINT [FK_dbo.HourlyLeaves_dbo.OrganizationUnits_OrganisationId]
GO
ALTER TABLE [dbo].[HourlyLeaves]  WITH CHECK ADD  CONSTRAINT [FK_dbo.HourlyLeaves_dbo.Projects_ProjectID] FOREIGN KEY([ProjectID])
REFERENCES [dbo].[Projects] ([ID])
GO
ALTER TABLE [dbo].[HourlyLeaves] CHECK CONSTRAINT [FK_dbo.HourlyLeaves_dbo.Projects_ProjectID]
GO
ALTER TABLE [dbo].[HourlyLeaves]  WITH CHECK ADD  CONSTRAINT [FK_dbo.HourlyLeaves_dbo.Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[HourlyLeaves] CHECK CONSTRAINT [FK_dbo.HourlyLeaves_dbo.Users_UserId]
GO
ALTER TABLE [dbo].[HourlyLeaves]  WITH CHECK ADD  CONSTRAINT [FK_dbo.HourlyLeaves_tsm.WorkflowStages_WorkflowStageID] FOREIGN KEY([WorkflowStageID])
REFERENCES [tsm].[WorkflowStages] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[HourlyLeaves] CHECK CONSTRAINT [FK_dbo.HourlyLeaves_tsm.WorkflowStages_WorkflowStageID]
GO
ALTER TABLE [dbo].[HourlyMissions]  WITH CHECK ADD  CONSTRAINT [FK_dbo.HourlyMissions_dbo.OrganizationUnits_OrganisationId] FOREIGN KEY([OrganisationId])
REFERENCES [dbo].[OrganizationUnits] ([ID])
GO
ALTER TABLE [dbo].[HourlyMissions] CHECK CONSTRAINT [FK_dbo.HourlyMissions_dbo.OrganizationUnits_OrganisationId]
GO
ALTER TABLE [dbo].[HourlyMissions]  WITH CHECK ADD  CONSTRAINT [FK_dbo.HourlyMissions_dbo.Projects_ProjectID] FOREIGN KEY([ProjectID])
REFERENCES [dbo].[Projects] ([ID])
GO
ALTER TABLE [dbo].[HourlyMissions] CHECK CONSTRAINT [FK_dbo.HourlyMissions_dbo.Projects_ProjectID]
GO
ALTER TABLE [dbo].[HourlyMissions]  WITH CHECK ADD  CONSTRAINT [FK_dbo.HourlyMissions_dbo.Users_UserID] FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[HourlyMissions] CHECK CONSTRAINT [FK_dbo.HourlyMissions_dbo.Users_UserID]
GO
ALTER TABLE [dbo].[HourlyMissions]  WITH CHECK ADD  CONSTRAINT [FK_dbo.HourlyMissions_tsm.WorkflowStages_WorkflowStageID] FOREIGN KEY([WorkflowStageID])
REFERENCES [tsm].[WorkflowStages] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[HourlyMissions] CHECK CONSTRAINT [FK_dbo.HourlyMissions_tsm.WorkflowStages_WorkflowStageID]
GO
ALTER TABLE [dbo].[OrganizationUnits]  WITH CHECK ADD  CONSTRAINT [FK_dbo.OrganizationUnits_dbo.Users_ManagerID] FOREIGN KEY([ManagerID])
REFERENCES [dbo].[Users] ([ID])
GO
ALTER TABLE [dbo].[OrganizationUnits] CHECK CONSTRAINT [FK_dbo.OrganizationUnits_dbo.Users_ManagerID]
GO
ALTER TABLE [dbo].[Projects]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Projects_dbo.Users_OwnerID] FOREIGN KEY([OwnerID])
REFERENCES [dbo].[Users] ([ID])
GO
ALTER TABLE [dbo].[Projects] CHECK CONSTRAINT [FK_dbo.Projects_dbo.Users_OwnerID]
GO
ALTER TABLE [dbo].[Projects]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Projects_tsm.Calendars_CalendarID] FOREIGN KEY([CalendarID])
REFERENCES [tsm].[Calendars] ([ID])
GO
ALTER TABLE [dbo].[Projects] CHECK CONSTRAINT [FK_dbo.Projects_tsm.Calendars_CalendarID]
GO
ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Tasks_dbo.Projects_ProjectID] FOREIGN KEY([ProjectID])
REFERENCES [dbo].[Projects] ([ID])
GO
ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK_dbo.Tasks_dbo.Projects_ProjectID]
GO
ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Tasks_dbo.Tasks_ParentTaskID] FOREIGN KEY([ParentTaskID])
REFERENCES [dbo].[Tasks] ([ID])
GO
ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK_dbo.Tasks_dbo.Tasks_ParentTaskID]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Users_dbo.OrganizationUnits_OrganizationUnitID] FOREIGN KEY([OrganizationUnitID])
REFERENCES [dbo].[OrganizationUnits] ([ID])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_dbo.Users_dbo.OrganizationUnits_OrganizationUnitID]
GO
ALTER TABLE [tsm].[DisplayPeriods]  WITH CHECK ADD  CONSTRAINT [FK_tsm.DisplayPeriods_dbo.Users_EmployeeID] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Users] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [tsm].[DisplayPeriods] CHECK CONSTRAINT [FK_tsm.DisplayPeriods_dbo.Users_EmployeeID]
GO
ALTER TABLE [tsm].[Holidays]  WITH CHECK ADD  CONSTRAINT [FK_tsm.Holidays_tsm.Calendars_CalendarID] FOREIGN KEY([CalendarID])
REFERENCES [tsm].[Calendars] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [tsm].[Holidays] CHECK CONSTRAINT [FK_tsm.Holidays_tsm.Calendars_CalendarID]
GO
ALTER TABLE [tsm].[PresenceHours]  WITH CHECK ADD  CONSTRAINT [FK_tsm.PresenceHours_dbo.Users_EmployeeID] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Users] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [tsm].[PresenceHours] CHECK CONSTRAINT [FK_tsm.PresenceHours_dbo.Users_EmployeeID]
GO
ALTER TABLE [tsm].[WorkHourHistories]  WITH CHECK ADD  CONSTRAINT [FK_tsm.WorkHourHistories_dbo.Users_ManagerID] FOREIGN KEY([ManagerID])
REFERENCES [dbo].[Users] ([ID])
GO
ALTER TABLE [tsm].[WorkHourHistories] CHECK CONSTRAINT [FK_tsm.WorkHourHistories_dbo.Users_ManagerID]
GO
ALTER TABLE [tsm].[WorkHourHistories]  WITH CHECK ADD  CONSTRAINT [FK_tsm.WorkHourHistories_tsm.WorkflowStages_StageID] FOREIGN KEY([StageID])
REFERENCES [tsm].[WorkflowStages] ([ID])
GO
ALTER TABLE [tsm].[WorkHourHistories] CHECK CONSTRAINT [FK_tsm.WorkHourHistories_tsm.WorkflowStages_StageID]
GO
ALTER TABLE [tsm].[WorkHours]  WITH CHECK ADD  CONSTRAINT [FK_tsm.WorkHours_dbo.Projects_ProjectId] FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Projects] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [tsm].[WorkHours] CHECK CONSTRAINT [FK_tsm.WorkHours_dbo.Projects_ProjectId]
GO
ALTER TABLE [tsm].[WorkHours]  WITH CHECK ADD  CONSTRAINT [FK_tsm.WorkHours_dbo.Tasks_TaskID] FOREIGN KEY([TaskID])
REFERENCES [dbo].[Tasks] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [tsm].[WorkHours] CHECK CONSTRAINT [FK_tsm.WorkHours_dbo.Tasks_TaskID]
GO
ALTER TABLE [tsm].[WorkHours]  WITH CHECK ADD  CONSTRAINT [FK_tsm.WorkHours_dbo.Users_EmployeeID] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Users] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [tsm].[WorkHours] CHECK CONSTRAINT [FK_tsm.WorkHours_dbo.Users_EmployeeID]
GO
ALTER TABLE [tsm].[WorkHours]  WITH CHECK ADD  CONSTRAINT [FK_tsm.WorkHours_tsm.WorkflowStages_WorkflowStageID] FOREIGN KEY([WorkflowStageID])
REFERENCES [tsm].[WorkflowStages] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [tsm].[WorkHours] CHECK CONSTRAINT [FK_tsm.WorkHours_tsm.WorkflowStages_WorkflowStageID]
GO
USE [master]
GO
ALTER DATABASE [RASTimeSheets] SET  READ_WRITE 
GO
