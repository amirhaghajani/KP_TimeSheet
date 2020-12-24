SELECT TOP (1000) [ID]
      ,[Date]
      ,[EmployeeID]
      ,[Hours]
      ,[InTime]
      ,[OutTime]
  FROM [ForTest].[tsm].[PresenceHours]
  where EmployeeID='e2f7c45f-5beb-e911-80c4-000c29db41e2'

  insert into [ForTest].[tsm].[PresenceHours]
  (id,date,EmployeeID,[Hours])
  VALUEs (NEWID(),'2020-12-25','e2f7c45f-5beb-e911-80c4-000c29db41e2', 9 )
  ,(NEWID(),'2020-12-24','e2f7c45f-5beb-e911-80c4-000c29db41e2', 10 )
  ,(NEWID(),'2020-12-23','e2f7c45f-5beb-e911-80c4-000c29db41e2', 11 )
  ,(NEWID(),'2020-12-27','e2f7c45f-5beb-e911-80c4-000c29db41e2', 12 )




  -- 50199638-8e67-e911-80be-000c29db41e2   kpe0\spfarm
  -- 566166fe-5aeb-e911-80c4-000c29db41e2   timesheet
  -- e2f7c45f-5beb-e911-80c4-000c29db41e2   timesheet1

  update Users set UserName='alireza1'
  where ID in ('50199638-8e67-e911-80be-000c29db41e2','566166fe-5aeb-e911-80c4-000c29db41e2','e2f7c45f-5beb-e911-80c4-000c29db41e2')


update Users set UserName='kpe0\alireza' WHERE
id ='566166fe-5aeb-e911-80c4-000c29db41e2'

select * from Users where UserName like N'%alireza%'



select * from tsm.WorkHours a 
		left join tsm.WorkflowStages b on a.WorkflowStageID=b.ID
		left join Tasks t on t.ID=a.TaskID
		left join Projects p on p.ID=t.ProjectID