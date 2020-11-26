using KP.TimeSheets.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using Threading = System.Threading.Tasks;

namespace KP.TimeSheets.Persistance
{
    internal class PWATranslator
    {

        public static Project ToProject(DataRow row)
        {
            var entity = new Project();

            entity.ID = row.Field<Guid>("ProjectUID");

            if (row["ProjectName"] != DBNull.Value)
                entity.Title = row.Field<string>("ProjectName");

           

            if (row["OwnerName"] != DBNull.Value)
            {
                entity.Owner = new User();
                entity.Owner.UserTitle = row.Field<string>("OwnerName").Trim();
            }

            if (row["ResourceID"] != DBNull.Value)
            {
                entity.Owner = entity.Owner ?? new User();
                entity.Owner.ID = row.Field<Guid>("ResourceID");
                entity.OwnerID = row.Field<Guid>("ResourceID");
            }

            if (row["UserName"] != DBNull.Value)
            {
                string userName = row.Field<string>("UserName").Trim();
                userName = userName.Substring(userName.IndexOf("|") + 1);
                entity.Owner = entity.Owner ?? new User();
                entity.Owner.UserName = userName;
            }

            return entity;
        }

        public static List<Project> ToProjects(DataTable dataTable)
        {
            var entities = new List<Project>();

            for (var i = 0; i < dataTable.Rows.Count; i++)
            {
                var entity = ToProject(dataTable.Rows[i]);
                if (entities.Any(x => x.ID == entity.ID))
                    continue;
                entities.Add(entity);
            }

            return entities;

        }

        public static Task ToTask(DataRow row)
        {
            var entity = new Task();

            entity.ID = row.Field<Guid>("TaskUID");

            if (row["ProjectUID"] != DBNull.Value)
                entity.ProjectID = row.Field<Guid>("ProjectUID");

            if (row["TaskName"] != DBNull.Value)
                entity.Title = row.Field<string>("TaskName");

            if (row["TaskParentUID"] != DBNull.Value)
                entity.ParentTaskID = row.Field<Guid>("TaskParentUID");

            return entity;
        }

        public static List<Task> ToTasks(DataTable dataTable)
        {
            var entities = new List<Task>();

            for (var i = 0; i < dataTable.Rows.Count; i++)
            {
                var entity = ToTask(dataTable.Rows[i]);
                if (entities.Any(x => x.ID == entity.ID))
                    continue;
                entities.Add(entity);
            }

            return entities;

        }

        public static User ToUser(DataRow row)
        {
            var entity = new User();

            entity.ID = (row["ResourceUID"] != DBNull.Value) ? row.Field<Guid>("ResourceUID") : Guid.NewGuid();

            if (row["ResourceName"] != DBNull.Value)
                entity.UserTitle= row.Field<string>("ResourceName");

            if (row["ResourceNTAccount"] != DBNull.Value)
            {
                string userName = row.Field<string>("ResourceNTAccount").Trim();
                userName = userName.Substring(userName.IndexOf("|") + 1);
                entity.UserName = userName;
            }

            if (row["EmployeeCode"] != DBNull.Value)
            {
                entity.Code = row.Field<string>("EmployeeCode");
            }

            return entity;
        }

        public static List<User> ToUsers(DataTable dataTable,IEnumerable<User> users)
        {
            var entities = new List<User>();

            for (var i = 0; i < dataTable.Rows.Count; i++)
            {
                var entity = ToUser(dataTable.Rows[i]);
                if (entities.Any(x => x.ID == entity.ID))
                    continue;
                entities.Add(entity);
            }

            foreach (var user in users)
            {
                if (entities.Any(x => x.ID == user.ID))
                    entities.First(x => x.ID == user.ID).OrganizationUnitID = user.OrganizationUnitID;
                    

            }

            return entities;

        }

        public static Assignment ToAssignment(DataRow row)
        {
            var entity = new Assignment();

            entity.ID = (row["AssignmentUID"] != DBNull.Value) ? row.Field<Guid>("AssignmentUID") : Guid.NewGuid();

            if (row["ProjectUID"] != DBNull.Value)
                entity.ProjectID = row.Field<Guid>("ProjectUID");

            if (row["ResourceUID"] != DBNull.Value)
                entity.ResourceID = row.Field<Guid>("ResourceUID");

            if (row["TaskUID"] != DBNull.Value)
                entity.TaskID = row.Field<Guid>("TaskUID");

            return entity;
        }

        public static List<Assignment> ToAssignments(DataTable dataTable)
        {
            var entities = new List<Assignment>();

            for (var i = 0; i < dataTable.Rows.Count; i++)
            {
                var entity = ToAssignment(dataTable.Rows[i]);
                if (entities.Any(x => x.ID == entity.ID))
                    continue;
                entities.Add(entity);
            }

            return entities;

        }

    }
}
