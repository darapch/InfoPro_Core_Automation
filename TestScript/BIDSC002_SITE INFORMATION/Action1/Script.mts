If VerifyScreenHeader("SITE INFORMATION") Then	
	Environment.Value("Site") = func_SetToMaxFieldLength(Environment.Value("Site"),5)
	If GetAndVerifyTeFieldValue("BIDSC002_SITE INFORMATION","Site Number",Environment.Value("Site")) Then
		Call func_reportStatus("Pass","Verify Site '" & Environment.Value("Site") & "'","Site '" & Environment.Value("Site") & "' is displayed")
		Select Case UCase(Environment.Value("Purpose"))
			Case "MOVE FORWARD"
				Call func_SendKey("ENTER")
		End Select
	Else
		Call func_reportStatus("Fail","Verify Site '" & Environment.Value("Site") & "'","Site '" & Environment.Value("Site") & "' is NOT displayed")		
		Call func_SetReturnCodeToZero()
	End If
Else
	Call func_SetReturnCodeToZero()
End If
