'Purpose : To submit the "EOD - Service Charge Generation"
'Author : Chinnikrishna Darapureddy

If TeWindow("InfoProWindow").TeScreen("STDJC20").TeField("Job Submission Window").Exist(5) Then
	Call func_reportStatus("Pass","Verify Job Submission Window","The Job Submission Window is Opened")
	If TeWindow("InfoProWindow").TeScreen("STDJC20").TeField("EOD SERVICE CHARGE GEN").Exist(1) Then
		Call func_reportStatus("Pass","Verify the information 'EOD SERVICE CHARGE GEN'","'EOD SERVICE CHARGE GEN' is displayed")
		Call func_SendKey("ENTER")
		wait(2)
'		If NOT TeWindow("InfoProWindow").TeScreen("STDJC20").TeField("Job Submission Window").Exist(1) Then
'			Call func_reportStatus("Pass","Submit the Job","The Job has been submitted")
'			Call func_SendKey("F4")						
'			strCommand = "WRKUSRJOB STATUS(*JOBQ) JOBTYPE(*INTER)"
'			strJobChangeCmd = "JOBQ(INFONOMAX)"
'			Call func_EnterValueInTeField("Work With User Jobs","Command Prompt",strCommand)
'			Call func_SendKey("ENTER")			
'			intStartFieldID = 642			
'			While NOT TeWindow("InfoProWindow").TeScreen("Work With User Jobs").TeField("No Jobs To Display").Exist(1)
'				TeWindow("InfoProWindow").TeScreen("Work With User Jobs").TeField("field id:=" & intStartFieldID).Set "2"
'				Call func_EnterValueInTeField("Work With User Jobs","Command Prompt",strJobChangeCmd)
'				Call func_SendKey("ENTER")
'				Call func_SendKey("F5")
'			Wend
'			Call func_SendKey("F3")
'			Call func_SendKey("F3")
'		Else
'			Call func_reportStatus("Fail","Submit the Job","The Job has been submitted")
'		End If					
	Else
		Call func_reportStatus("Fail","Verify the information 'EOD SERVICE CHARGE GEN'","'EOD SERVICE CHARGE GEN' is NOT displayed")
	End If
Else
	Call func_reportStatus("Fail","Verify Job Submission Window","The Job Submission Window is NOT Opened")
End If











