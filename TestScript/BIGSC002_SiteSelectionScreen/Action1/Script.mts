
intSpaces = 5-Len(Environment.Value("Site"))
Environment.Value("Site") = Space(intSpaces) & Environment.Value("Site")

If VerifyScreenHeader("SITE SELECTION SCREEN") Then
	
	Select Case UCase(Environment.Value("Purpose"))
		Case "SELECTSITE"		
			Call func_EnterValueInTeField("BIGSC002_SiteSelectionScreen","Locate Site",Environment.Value("Site"))
			Call func_sendkey("ENTER")
			intSiteFieldID = func_SearchItemInGrid(Environment.Value("Site"),0)
			If intSiteFieldID>0 Then			
				Call func_reportStatus("Pass","Verify the Site '" & Environment.Value("Site") & "'","The Site '" & Environment.Value("Site") & "' is available")
				intSiteStatusFieldID = intSiteFieldID-15
				strStatus = Trim(TeWindow("InfoProWindow").TeScreen("BIGSC002_SiteSelectionScreen").TeField("field id:=" & intSiteStatusFieldID).GetROProperty("text"))
				If strStatus="ACTIVE" Then
					intSelFieldID = intSiteFieldID-21							
					TeWindow("InfoProWindow").TeScreen("BIGSC002_SiteSelectionScreen").TeField("field id:=" & intSelFieldID).Set "1"			
					TeWindow("InfoProWindow").TeScreen("BIGSC002_SiteSelectionScreen").TeField("field id:=" & intSiteFieldID).SetCursorPos
					Call func_sendkey("ENTER")
'					If VerifyScreenHeader("SITE INFORMATION") Then
'						If GetAndVerifyTeFieldValue("BIGSC002_SiteSelectionScreen","Site Number",Environment.Value("Site")) Then						
'							Call func_reportStatus("Pass","Verify Site No '" & Environment.Value("Site") & "'","Site No '" & Environment.Value("Site") & "' is displayed")
'						Else
'							Call func_reportStatus("Fail","Verify Site No '" & Environment.Value("Site") & "'","Site No '" & Environment.Value("Site") & "' is NOT displayed")						
'						End If
'					End If
				Else
					Call func_reportStatus("Fail","Verify Site Status","The Status is NOT 'ACTIVE'")
				End If
			Else
				Call func_reportStatus("Fail","Verify the Site '" & Environment.Value("Site") & "'","The Site '" & Environment.Value("Site") & "' is NOT available")		
			End If
		
	End Select

End If




