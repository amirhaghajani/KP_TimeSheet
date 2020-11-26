using System.Collections.Generic;
using System.Data;
using System.Linq;
using Microsoft.Data.SqlClient;

namespace KP.TimeSheets.Persistance
{
    internal class SqlQueryExecute
    {

        public static DataTable GetDataTable(string cmdText, string connectionName)
        {
            var connection = new SqlConnection(connectionName);
            var command = new SqlCommand();
            connection.Open();
            command.Connection = connection;
            command.CommandText = cmdText;
            var dataTable = new DataTable();
            var dataAdapter = new SqlDataAdapter(command);
            dataAdapter.Fill(dataTable);
            connection.Close();
            return dataTable;
        }

        public static DataTable GetDataTable(string cmdText, string connectionName,List<string>databaseNames)
        {
            var commandText = GetCommand(databaseNames, cmdText);
            var connection = new SqlConnection(connectionName);
            var command = new SqlCommand();
            connection.Open();
            command.Connection = connection;
            command.CommandText = commandText;
            var dataTable = new DataTable();
            var dataAdapter = new SqlDataAdapter(command);
            dataAdapter.Fill(dataTable);
            connection.Close();
            return dataTable;
        }

        public static object GetScalar(string prmConnString, string prmCommandText)
        {
            object result = new object();
            try
            {
                var connection = new SqlConnection(prmConnString);
                var command = new SqlCommand();
                connection.Open();
                command.Connection = connection;
                command.CommandText = prmCommandText;
                result = command.ExecuteScalar();
                connection.Close();
            }
            catch
            {
                result = null;
            }
            return result;
        }


        public static string GetCommand(List<string> dataBaseNames, string command)
        {
            if (dataBaseNames==null || !dataBaseNames.Any())
                return command;
            var result = string.Empty;
            if (dataBaseNames[0] == string.Empty)
                return command.Replace("DataBaseName.", "");
            result = command.Replace("DataBaseName", dataBaseNames[0]);
            for (var i = 1; i < dataBaseNames.Count; i++)
            {
                result += "  union  " + command.Replace("DataBaseName", dataBaseNames[i]);
            }

            return result;
        }


       
    }
}
