
'On Error Resume Next
'Environment.Value("ContainerGroup")=1
Environment.Value("ContainerGroup") = func_SetToMaxFieldLength(Environment.Value("ContainerGroup"),2)

If VerifyScreenHeader("CONTAINER INFORMATION") Then
	If GetAndVerifyTeFieldValue("BIDSC002_CONTAINER INFORMATION","Group Number",Environment.Value("ContainerGroup")) Then			
		Call func_reportStatus("Pass","Verify Container Group","The Container Group '" & Environment.Value("ContainerGroup") & "' is displayed")
		Select Case UCase(Environment.Value("Purpose"))
			Case "MOVE FORWARD"
				Call func_SendKey("ENTER")				
		End Select		
	Else
		Call func_reportStatus("Fail","Verify Container Group","The Container Group '" & Environment.Value("ContainerGroup") & "' is NOT displayed")
		Call func_SetReturnCodeToZero()
	End If
End If

Call func_SetReturnCodeToZerOnError()


