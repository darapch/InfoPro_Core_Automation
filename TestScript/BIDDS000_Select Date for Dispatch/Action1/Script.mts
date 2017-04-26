
If VerifyScreenHeader("Select Date for Dispatch")=False Then
	Call func_SetReturnCodeToZero()
End If
Environment.Value("FMT") = "C"
Environment.Value("Action") = "S"
intFMTs = GetChildObjectCountByText(UCase(Environment.Value("FMT")))
If intFMTs<1 Then
	Call func_reportStatus("Fail","No Dates found to select","No Dates availabel to select '" & Environment.Value("FMT") & "'")
	Call func_SetReturnCodeToZero()
End If

For intFMTCount = 1 To intFMTs
	intLatestFMTFieldID = func_SearchItemInGrid("C",intFMTCount-1)
	intDateToSelectFieldID = intLatestFMTFieldID+3
	dtDate = TeWindow("InfoProWindow").TeScreen("BIDDS000_Select Date for Dispatch").TeField("field id:=" & intDateToSelectFieldID).Text
	If DateDiff("d",CDate(dtDate),Date)>=0 Then		
		Call func_reportStatus("Pass","Date found to select","Date found to select '" & dtDate & "'")
		Exit For
	End If
Next

TeWindow("InfoProWindow").TeScreen("BIDDS000_Select Date for Dispatch").TeField("field id:=" & intLatestFMTFieldID).SetCursorPos
Call func_sendkey("BACKTAB")
Call func_sendkey("S")
Call func_sendkey("ENTER")




