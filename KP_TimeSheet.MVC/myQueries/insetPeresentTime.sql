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
  VALUEs (NEWID(),'2020-12-19','e2f7c45f-5beb-e911-80c4-000c29db41e2', 9 )
  ,(NEWID(),'2020-12-20','e2f7c45f-5beb-e911-80c4-000c29db41e2', 10 )
  ,(NEWID(),'2020-12-21','e2f7c45f-5beb-e911-80c4-000c29db41e2', 11 )
  ,(NEWID(),'2020-12-22','e2f7c45f-5beb-e911-80c4-000c29db41e2', 12 )




  -- 50199638-8e67-e911-80be-000c29db41e2   kpe0\spfarm
  -- 566166fe-5aeb-e911-80c4-000c29db41e2   timesheet
  -- e2f7c45f-5beb-e911-80c4-000c29db41e2   timesheet1

  update Users set UserName='alireza1'
  where ID in ('50199638-8e67-e911-80be-000c29db41e2','566166fe-5aeb-e911-80c4-000c29db41e2','e2f7c45f-5beb-e911-80c4-000c29db41e2')


update Users set UserName='alireza' WHERE
id ='566166fe-5aeb-e911-80c4-000c29db41e2'

select * from Users where UserName like N'%alireza%'