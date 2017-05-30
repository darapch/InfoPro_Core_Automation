'
'Environment.Value("Format") = "C"
'Environment.Value("Action") = "S"
'Environment.Value("Date") = ""
'Environment.Value("RootPath") = "C:\Users\darapch\Desktop\Automation\InfoPro_Automation\"
RepositoriesCollection.Add Environment.Value("RootPath") & "ObjectRepository\InforProOR.tsr"
If VerifyScreenHeader("Select Date for Dispatch")=False Then
	Call func_SetReturnCodeToZero()
End If

	intFMTs = GetChildObjectCountByText(UCase(Environment.Value("Format")))
	If intFMTs<1 Then
		Call func_reportStatus("Fail","No Dates found to select","No Dates available to select '" & Environment.Value("Format") & "'")
		Call func_SetReturnCodeToZero()
	End If
	intRoute = 0
	For intFMTCount = intFMTs To 1 step -1		
			intLatestFMTFieldID = func_SearchItemInGrid(Environment.Value("Format"),intFMTCount-1)
			intDateToSelectFieldID = intLatestFMTFieldID+3
			dtDate = Trim(TeWindow("InfoProWindow").TeScreen("BIDDS000_Select Date for Dispatch").TeField("field id:=" & intDateToSelectFieldID).Text)
			If Environment.Value("Date")="" Then
				If DateDiff("d",CDate(dtDate),Date)>=0 Then		
'					Call func_reportStatus("Pass","Date found to select","Date found to select '" & dtDate & "'")
					Call SetEmulatorStatusToReady()
					TeWindow("InfoProWindow").TeScreen("BIDDS000_Select Date for Dispatch").TeField("field id:=" & intLatestFMTFieldID).SetCursorPos
					Call func_sendkey("BACKTAB")
					wait(1)
					Call func_sendkey("D")
					wait(1)
					Call func_sendkey("ENTER")
					wait(2)
					
					intRoute = VerifyRouteStatus()
					
					Call func_sendkey("F12")
					wait(1)
					If intRoute>0 Then
						Call func_reportStatus("Pass","Date found to select","Date found to select '" & dtDate & "'")					
'						Call func_sendkey("S")
'						wait(1)
'						Call func_sendkey("ENTER")
'						wait(1)
'						If TeWindow("InfoProWindow").TeScreen("BIDDS000_Select Date for Dispatch").TeField("TimeEditOptionWindow").Exist(2) Then
'							Call func_sendkey("ENTER")
'							wait(1)
'						End If
						Exit For
					End If
					
				End If
			Else
				If DateDiff("d",CDate(dtDate),CDate(Environment.Value("Date")))=0 Then		
					Call func_reportStatus("Pass","Date found to select","Date found to select '" & dtDate & "'")
					TeWindow("InfoProWindow").TeScreen("BIDDS000_Select Date for Dispatch").TeField("field id:=" & intDateToSelectFieldID).SetCursorPos
					Call func_sendkey("BACKTAB")
					wait(2)
'					Call func_sendkey(Environment.Value("Action"))
'					wait(1)
'					Call func_sendkey("ENTER")
					intRoute=1
					Exit For
				End If
			End If
	Next
	
	If intRoute=0 Then
		Call func_reportStatus("Fail","NO Date found to select","NO Date found to select")	
		Call func_SetReturnCodeToZero()
	Else
		Call func_sendkey("S")
		wait(1)
		Call func_sendkey("ENTER")
		wait(1)
		If TeWindow("InfoProWindow").TeScreen("BIDDS000_Select Date for Dispatch").TeField("TimeEditOptionWindow").Exist(2) Then
			Call func_sendkey("ENTER")
			wait(1)
		End If
	End If














