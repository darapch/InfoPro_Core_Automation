

Environment.Value("DivisionNumber") = "902"
intsupposedSpaces = 5-Len(Environment.Value("DivisionNumber"))
Environment.Value("DivisionNumber") = Space(intsupposedSpaces) & Environment.Value("DivisionNumber")
Environment.Value("AccountNumber") = "9523877"
Environment.Value("Site") = "00001"
Environment.Value("ServiceNumber") = "34703"

If Len(Month(Now))=1 Then
	Environment.Value("ScheduledCompletionMonth") = "0" & Month(Now)
Else
	Environment.Value("ScheduledCompletionMonth") = Month(Now)
End If

If Len(Day(Now))=1 Then
	Environment.Value("ScheduledCompletionDate") = "0" & Day(Now)
Else
	Environment.Value("ScheduledCompletionDate") = Day(Now)
End If

Set obj_conn = CreateObject("ADODB.Connection")

str_connectionString = "Driver={iSeries Access ODBC Driver};System=sys01;Uid=darapch;Pwd=Sachin8187"
	
obj_conn.open str_connectionString

str_sqlQuery = "SELECT * FROM NAEAIPDN.P_BIPSUO WHERE TRSUCOMP='" & Environment.Value("DivisionNumber") & "' and TRSUSRVN=" & Environment.Value("ServiceNumber")
Set obj_resultSet = obj_conn.Execute(str_sqlQuery)

intRecords = 0
intBIPSUOCount = 0
intBIPSXCount = 0
While NOT obj_resultSet.EOF
	intRecords = intRecords + 1
	If Trim(obj_resultSet("TRIGGER_TABLE"))="BIPSUO" Then
		intBIPSUOCount = intBIPSUOCount + 1
	End If 
	If Trim(obj_resultSet("TRIGGER_TABLE"))="BIPSX" Then
		intBIPSXCount = intBIPSXCount + 1
	End If	
	obj_resultSet.MoveNext
Wend


If intRecords=0 Then
	Call func_reportStatus("Fail","No Records Available","No Records Available")
	ExitTest
End If

If intBIPSUOCount>0 Then
	Call func_reportStatus("Pass","Verify Record Existancy for the Trigger Table BIPSUO","Atleast 1 Record is available for BIPSUO")
Else
	Call func_reportStatus("Fail","Verify Record Existancy for the Trigger Table BIPSUO","No Record is available for BIPSUO")
End If


If intBIPSXCount>0 Then
	Call func_reportStatus("Pass","Verify Record Existancy for the Trigger Table BIPSX","Atleast 1 Record is available for BIPSX")
Else
	Call func_reportStatus("Fail","Verify Record Existancy for the Trigger Table BIPSX","No Record is available for BIPSX")
End If


If intBIPSXCount=0 Or intBIPSUOCount=0 Then
	'ExitTest
End If

obj_resultSet.MoveFirst
strCompositeKey = Trim(obj_resultSet("COMPOSITE_KEY"))

Call func_reportStatus("Done","Get Composite Key","The Composite Key : " & strCompositeKey

Environment.Value("TimeStamp") = Year(Now) & Environment.Value("ScheduledCompletionMonth") & Environment.Value("ScheduledCompletionDate")

strDivisionFound = Mid(strCompositeKey,1,3)
strAccountFound = Mid(strCompositeKey,4,7)
strSiteFound = Mid(strCompositeKey,11,4)
strServiceNumFound = Mid(strCompositeKey,15,5)
strTimeStamp = Mid(strCompositeKey,20,8)

If strDivisionFound=Environment.Value("DivisionNumber") Then
	Call func_reportStatus("Pass","Verify Division Number in CompsiteKey","The characters 1-3 of composite key is '" & strDivisionFound & "' and same as to the Division Number '" & Environment.Value("DivisionNumber") & "'")
Else
	Call func_reportStatus("Fail","Verify Division Number in CompsiteKey","The First 3 characters of composite key is '" & strDivisionFound & "' and NOT same as to the Division Number '" & Environment.Value("DivisionNumber") & "'")
End If

If strAccountFound=Environment.Value("AccountNumber") Then
	Call func_reportStatus("Pass","Verify Account/Customer Number in CompsiteKey","The characters 4-7 of composite key is '" & strAccountFound & "' and same as to the Account/Customer Number '" & Environment.Value("AccountNumber") & "'")
Else
	Call func_reportStatus("Fail","Verify Account/Customer Number in CompsiteKey","The characters 4-7 of composite key is '" & strAccountFound & "' and NOT same as to the Account/Customer Number '" & Environment.Value("AccountNumber") & "'")
End If

If strSiteFound=Environment.Value("Site") Then
	Call func_reportStatus("Pass","Verify Site Number in CompsiteKey","The characters 11-14 of composite key is '" & strSiteFound & "' and same as to the Account/Customer Number '" & Environment.Value("Site") & "'")
Else
	Call func_reportStatus("Fail","Verify Site Number in CompsiteKey","The characters 11-14 of composite key is '" & strSiteFound & "' and NOT same as to the Account/Customer Number '" & Environment.Value("Site") & "'")
End If

If strServiceNumFound=Environment.Value("ServiceNumber") Then
	Call func_reportStatus("Pass","Verify Service Number in CompsiteKey","The characters 15-19 of composite key is '" & strServiceNumFound & "' and same as to the Account/Customer Number '" & Environment.Value("ServiceNumber") & "'")
Else
	Call func_reportStatus("Fail","Verify Service Number in CompsiteKey","The characters 15-19 of composite key is '" & strServiceNumFound & "' and NOT same as to the Account/Customer Number '" & Environment.Value("ServiceNumber") & "'")
End If


If strTimeStamp=Environment.Value("TimeStamp") Then
	Call func_reportStatus("Pass","Verify Time Stamp(YYYYMMDD) in CompsiteKey","The characters 20-27 of composite key is '" & strTimeStamp & "' Whiich is same as " & Environment.Value("TimeStamp"))
Else
	Call func_reportStatus("Pass","Verify Time Stamp(YYYYMMDD) in CompsiteKey","The characters 20-27 of composite key is '" & strTimeStamp & "' Whiich is same as " & Environment.Value("TimeStamp"))
End If



