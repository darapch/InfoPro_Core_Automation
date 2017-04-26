If VerifyScreenHeader("CONTAINER RATE INFORMATION") Then
	If TeWindow("InfoProWindow").TeScreen("BIDSC002_CONTAINER RATE INFORMATION").TeField("ChargeCode").Exist(2) Then
		strChgCode = TeWindow("InfoProWindow").TeScreen("BIDSC002_CONTAINER RATE INFORMATION").TeField("ChargeCode").GetROProperty("text")
		If strChgCode<>"" Then
			Call func_reportStatus("Pass","Verify Chg Code in Container Rate Information screen","The Chg Code '" & strChgCode & "' is available")
		Else
			Call func_reportStatus("Fail","Verify Chg Code in Container Rate Information screen","The Chg Code '" & strChgCode & "' is NOT available")
			Call func_SetReturnCodeToZero()			
		End If
	Else
		Call func_reportStatus("Fail","No Record Available","No Record Available") 
		Call func_SetReturnCodeToZero()		
	End If
Else	
	Call func_SetReturnCodeToZero()
End If
