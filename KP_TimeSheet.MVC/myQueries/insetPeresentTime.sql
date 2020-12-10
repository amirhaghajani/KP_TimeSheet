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
  VALUEs (NEWID(),'2020-12-9','e2f7c45f-5beb-e911-80c4-000c29db41e2', 11 )
  ,(NEWID(),'2020-12-8','e2f7c45f-5beb-e911-80c4-000c29db41e2', 11 )
  ,(NEWID(),'2020-12-13','e2f7c45f-5beb-e911-80c4-000c29db41e2', 11 )
  ,(NEWID(),'2020-12-14','e2f7c45f-5beb-e911-80c4-000c29db41e2', 11 )