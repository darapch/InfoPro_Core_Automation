'Purpose : To submit the "EOD - Dispatch" and to make the status to OUTQ
'Author : Chinnikrishna Darapureddy



'Environment.Value("Job") = "h"
'Environment.Value("DivisionNumber") = "902"
If TeWindow("InfoProWindow").TeScreen("STDJC20").TeField("Job Submission Window").Exist(5) Then
	Call func_reportStatus("Pass","Verify Job Submission Window","The Job Submission Window is Opened")
	Call func_sendkey("ENTER")
	Call func_sendkey("F4")
	Select Case UCase(Environment.Value("Job"))
		Case "EOD - DISPATCH"
			strJobText = "EODDISP" & Environment.Value("DivisionNumber")
		Case "EOD - BILLING ADJUSTMENTS"
			strJobText = "BILLING"
		Case "EOD - INVOICE GENERATION"
			strJobText = "INVC_" & Environment.Value("DivisionNumber")
		Case "EOD - FULL CHARGE"
			strJobText = "INVC_" & Environment.Value("DivisionNumber") 'Remember Need to change
		Case "EOD - SERVICE CHARGE GENERATION"
			strJobText = "INVC_" & Environment.Value("DivisionNumber") 'Remember Need to change
		Case "EOD - VEHICLE MAINTENANCE"
			strJobText = "VMS_EOD"
		Case "EOD - CONSOLIDATED RUN"
			strJobText = "INVC_" & Environment.Value("DivisionNumber") 'Remember Need to change	
		Case "EOD - RESET RESIDENTIALS RATES"
			strJobText = "INVC_" & Environment.Value("DivisionNumber") 'Remember Need to change	
		Case "EOD - RESET CONTRACT RATES"
			strJobText = "INVC_" & Environment.Value("DivisionNumber") 'Remember Need to change
		Case "EOD - SALES REVENUE GENERATION"
			strJobText = "INVC_" & Environment.Value("DivisionNumber") 'Remember Need to change	
	End Select
	
	intJobsCount=0
	Call func_sendkey("F18")
	Do While NOT TeWindow("InfoProWindow").TeScreen("STDJC20").TeField("MsgAlreadyTop").Exist(2)
		intJobsCount = GetChildObjectCountByText(strJobText)
		If intJobsCount>0 Then	
			intJobFieldID = TeWindow("InfoProWindow").TeScreen("Work With User Jobs").TeField("text:=" & strJobText,"index:=" & intJobsCount-1).GetROProperty("field id")
			intStatusFieldID = intJobFieldID + 33
			strStatus = Trim(TeWindow("InfoProWindow").TeScreen("Work With User Jobs").TeField("field id:=" & intStatusFieldID).GetROProperty("text"))
			If strStatus<>"OUTQ" Then
				TeWindow("InfoProWindow").TeScreen("Work With User Jobs").TeField("field id:=" & intJobFieldID).SetCursorPos
				Call func_sendkey("BACKTAB")
				Call func_sendkey("2")
				strJobChangeCmd = "JOBQ(INFONOMAX)"
				Call func_EnterValueInTeField("Work With User Jobs","Command Prompt",strJobChangeCmd)
				Call func_sendkey("ENTER")
				Call func_sendkey("F5")
				strStatus = Trim(TeWindow("InfoProWindow").TeScreen("Work With User Jobs").TeField("field id:=" & intStatusFieldID).GetROProperty("text"))
				intWaitTime = 1
				Do While strStatus<>"OUTQ" And intWaitTime<=30
					Call func_sendkey("F5")
					strStatus = Trim(TeWindow("InfoProWindow").TeScreen("Work With User Jobs").TeField("field id:=" & intStatusFieldID).GetROProperty("text"))
					intWaitTime = intWaitTime+5
					Wait(2)
				Loop
				If strStatus="OUTQ" Then
					Call func_reportStatus("Pass","Verify JOB Status for " & Environment.Value("Job"),"The Status changed to '" & strStatus & "' successfully")
				Else
					Call func_reportStatus("Fail","Verify JOB Status for " & Environment.Value("Job"),"The Status is NOT changed to '" & strStatus & "' successfully. Observed Till " & intWaitTime & " seconds")
				End If
				
			Else 
				Call func_reportStatus("Pass","Verify JOB Status for " & Environment.Value("Job"),"The Status changed to '" & strStatus & "' successfully")
			End If	
			Exit Do
		Else
			Call func_SendKey("PAGEUP")
		End If
	Loop
	If intJobsCount=0 Then
		Call func_reportStatus("Fail","Search the JOB '" & strJobText & "'","The JOB '" & strJobText & "' is NOT found")
	End If
Else
	Call func_reportStatus("Fail","Verify Job Submission Window","The Job Submission Window is NOT Opened for " & Environment.Value("Job"))
End If











