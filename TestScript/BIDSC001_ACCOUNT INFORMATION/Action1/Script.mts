
If VerifyScreenHeader("ACCOUNT INFORMATION") Then
	
	If TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Protected:=True","attached text:=" & Environment.Value("AccountNumber") &  ".*protected.*").exist(4) Then
		Call func_reportStatus("Pass","Verify Account Information Screen","The Account Information screen is displayed for the account " & Environment.Value("AccountNumber"))
		Select Case UCase(Environment.Value("Purpose"))
			Case "VALIDATE"
				Call func_AccountAddressValidation()
			Case "MOVE FORWARD"	
				Call func_SendKey("ENTER")
				'If TeWindow("InfoProWindow").TeScreen("column count:=80").TeField("text:=CONTAINER SELECTION SCREEN").Exist(5) Then
				'	Call func_reportStatus("Pass","Hit ENTER on the 'Account Information' screen","'CONTAINER SELECTION SCREEN' is displayed")
				'End If
				If TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("RESUME").Exist(1) Then
					Call func_EnterValueInTeField("BIDSC001_AccountInformation","RESUME","R")
					Call func_SendKey("ENTER")
				End If
		End Select
	End If
Else
	Call func_SetReturnCodeToZero()
End If



'Environment.Value("AccountNumber") = "1127418"

Function func_AccountAddressValidation()		
	strOrigAccountName = TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Account Name").GetROProperty("text")
	strOrigStreetNum = TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Street Number").GetROProperty("text")
	strOrigStreetName = TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Street Name").GetROProperty("text")
	strOrigCity = TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("City").GetROProperty("text")
	strOrigState = TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("State").GetROProperty("text")
	strOrigZIPCode = TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("ZipCode").GetROProperty("text")
	
	Call func_reportStatus("Done", "Orininal Account Name", "Orininal Account Name : " & strOrigAccountName)
	Call func_reportStatus("Done", "Orininal Street Number", "Orininal Street Number : " & strOrigStreetNum)
	Call func_reportStatus("Done", "Orininal Street Name", "Orininal Street Name : " & strOrigStreetName)
	Call func_reportStatus("Done", "Orininal City", "Orininal City : " & strOrigCity)
	Call func_reportStatus("Done", "Orininal State", "Orininal State : " & strOrigState)
	Call func_reportStatus("Done", "Orininal ZIP Code", "Orininal ZIP Code : " & strOrigZIPCode)
	
	TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Account Name").Set ""
	Call func_SendKey("ENTER")
	If TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Name Required").Exist(2) Then
		Call func_reportStatus("Pass", "Delete Account Name Value", "Error message 'NAME REQUIRED' is displayed")
		Call func_EnterValueInTeField("BIDSC001_AccountInformation","Account Name",strOrigAccountName)
		Call func_SendKey("ENTER")
		Call func_SendKey("F12")
		
		If GetAndVerifyTeFieldValue("BIDSC001_AccountInformation","Account Name",strOrigAccountName) Then
			Call func_reportStatus("Pass", "Replace the Account Name value to its original value", "Replaced the Account Name value to its original value " & strOrigAccountName)
		Else
			Call func_reportStatus("Fail", "Replace the Account Name value to its original value", "Not Replaced to its original value " & strOrigAccountName)
		End If
	Else
		Call func_reportStatus("Fail", "Delete Account Name Value", "Error message 'NAME REQUIRED' is displayed")
	End If
	
	
	Call func_EnterValueInTeField("BIDSC001_AccountInformation","Street Number","9999")
	Call func_SendKey("ENTER")
	If TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Address not on streets").Exist(2) Then
		Call func_reportStatus("Pass", "Change the street number to '9999'", "An error message is displayed, Address not on street")
		Call func_EnterValueInTeField("BIDSC001_AccountInformation","RESUME","R")
		Call func_SendKey("ENTER")
		Call func_SendKey("F12")
		If GetAndVerifyTeFieldValue("BIDSC001_AccountInformation","Street Number","9999") Then
			Call func_reportStatus("Pass", "Change the street number to '9999'", "Street Number Changed to '9999'")	
			TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Street Number").Set ""
			Call func_SendKey("ENTER")
			If TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Street Not found in City").Exist(2) Then
				Call func_reportStatus("Pass", "Delete the street name", "The error message 'street not found in city' is displayed")
				Call func_EnterValueInTeField("BIDSC001_AccountInformation","RESUME","C")
				Call func_SendKey("ENTER")
				Call func_EnterValueInTeField("BIDSC001_AccountInformation","Street Number",strOrigStreetNum)
				Call func_SendKey("ENTER")
				Call func_SendKey("F12")
				If GetAndVerifyTeFieldValue("BIDSC001_AccountInformation","Street Number",strOrigStreetNum) Then
					Call func_reportStatus("Pass", "Replace the Street Number to its original value", "Replaced the Street Number to its original value " & strOrigStreetNum)
				Else
					Call func_reportStatus("Fail", "Replace the Street Number to its original value", "Not Replaced the Street Number to its original value " & strOrigStreetNum)
				End If
			Else
				Call func_reportStatus("Fail", "Delete the street name", "The error message 'street not found in city' is NOT displayed")
			End If	
		Else
			Call func_reportStatus("Fail", "Change the street number to '9999'", "Street Number is NOT Changed to '9999'")
			
		End If
	Else
		Call func_reportStatus("Fail", "Change the street number to '9999'", "An error message 'Address not on street' is not displayed")
	End If
	
	'Environment.Value("City") = "ROSEMES"
	Call func_EnterValueInTeField("BIDSC001_AccountInformation","City",Environment.Value("City"))
	Call func_SendKey("ENTER")
	intCorrectedAddrFieldID = TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Corrected Address").GetROProperty("field id")
	intToBeCorrectedCityFieldID = intCorrectedAddrFieldID + 160
	strToBeCorrectedCity = TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("field id:=" & intToBeCorrectedCityFieldID).GetROProperty("text")
	Call func_SendKey("ENTER")
	Call func_SendKey("F12")
	If GetAndVerifyTeFieldValue("BIDSC001_AccountInformation","City",strToBeCorrectedCity) Then
		Call func_reportStatus("Pass", "Verify City Corrected", "The city is corrected to '" & strToBeCorrectedCity & "'")
		TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("City").Set ""
		Call func_SendKey("ENTER")
		If TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("City Required").Exist(2) Then
			Call func_reportStatus("Pass", "Delete the city value", "Error message 'CITY REQUIRED' is displayed")
			Call func_EnterValueInTeField("BIDSC001_AccountInformation","City",strOrigCity)
			Call func_SendKey("ENTER")
			Call func_SendKey("F12")
			If GetAndVerifyTeFieldValue("BIDSC001_AccountInformation","City",strOrigCity) Then
				Call func_reportStatus("Pass", "Replace the City value to its original value", "Replaced the City value to its original value " & strOrigCity)
			Else
				Call func_reportStatus("Fail", "Replace the City value to its original value", "Not Replaced to its original value " & strOrigCity)
			End If
		Else
			Call func_reportStatus("Fail", "Delete the city value", "Error message 'CITY REQUIRED' is NOT displayed")
		End If
	Else
		Call func_reportStatus("Fail", "Verify City Corrected", "The city is NOT corrected to '" & strToBeCorrectedCity & "'")
	End If
	
	
	
	Call func_EnterValueInTeField("BIDSC001_AccountInformation","Street Name","abcd")
	Call func_SendKey("ENTER")
	If TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Street Name Not Found").Exist(2) Then
		Call func_reportStatus("Pass", "Change the street number to 'abcd'", "An error message is displayed, Address not on street")
		Call func_EnterValueInTeField("BIDSC001_AccountInformation","RESUME","R")
		Call func_SendKey("ENTER")
		Call func_SendKey("F12")
		If GetAndVerifyTeFieldValue("BIDSC001_AccountInformation","Street Name","ABCD") Then
			Call func_reportStatus("Pass", "Change the Street Name to 'ABCD'", "Street Name Changed to 'ABCD'")	
			TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Street Name").Set ""
			Call func_SendKey("ENTER")	
			If TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("ADDRESS Required").Exist(2) Then
				Call func_reportStatus("Pass", "Delete the Street Name", "Error message 'Address REQUIRED' is displayed")
				Call func_EnterValueInTeField("BIDSC001_AccountInformation","Street Name",strOrigStreetName)
				Call func_SendKey("ENTER")
				Call func_SendKey("F12")
				If GetAndVerifyTeFieldValue("BIDSC001_AccountInformation","Street Name",strOrigStreetName) Then
					Call func_reportStatus("Pass", "Replace the Street Name to its original value", "Replaced the Street Name to its original value " & strOrigStreetName)
				Else
					Call func_reportStatus("Fail", "Replace the Street Name to its original value", "Not Replaced the Street Name to its original value " & strOrigStreetName)
				End If
			Else
				Call func_reportStatus("Fail", "Delete the Street Name", "Error message 'Address REQUIRED' is NOT displayed")
			End If
		Else
			Call func_reportStatus("Fail", "Change the Street Name to 'ABCD'", "Street Name is NOT Changed to 'ABCD'")
			
		End If
	Else
		Call func_reportStatus("Fail", "Change the Street Name to 'ABCD'", "An error message 'Address not on street' is not displayed")
	End If
	
	
	
	
	
	
	
	'Environment.Value("State") = "FL"
	Call func_EnterValueInTeField("BIDSC001_AccountInformation","State",Environment.Value("State"))
	Call func_SendKey("ENTER")
	intCorrectedAddrFieldID = TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Corrected Address").GetROProperty("field id")
	intToBeCorrectedStateField = intCorrectedAddrFieldID + 191
	strToBeCorrectedState = TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("field id:=" & intToBeCorrectedStateField).GetROProperty("text")
	Call func_SendKey("ENTER")
	Call func_SendKey("F12")
	If GetAndVerifyTeFieldValue("BIDSC001_AccountInformation","State",strToBeCorrectedState) Then
		Call func_reportStatus("Pass", "Verify State Corrected", "The State is corrected to '" & strToBeCorrectedState & "'")
		TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("State").Set ""
		Call func_SendKey("ENTER")
		If TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("EnterStateProvince").Exist(2) Then
			Call func_reportStatus("Pass", "Delete the State", "ERROR : Please enter a valid State or Province")
			Call func_EnterValueInTeField("BIDSC001_AccountInformation","State",strOrigState)
			Call func_SendKey("ENTER")
			Call func_SendKey("F12")
			If GetAndVerifyTeFieldValue("BIDSC001_AccountInformation","State",strOrigState) Then
				Call func_reportStatus("Pass", "Replace the State to its original value", "Replaced the State to its original value " & strOrigState)
			Else
				Call func_reportStatus("Fail", "Replace the State to its original value", "Not Replaced to its original value " & strOrigState)
			End If
		Else
			Call func_reportStatus("Fail", "Delete the State", "ERROR 'Please enter a valid State or Province' is not displayed")
		End If
	Else
		Call func_reportStatus("Fail", "Verify State Corrected", "The State is NOT corrected to '" & strToBeCorrectedState & "'")
	End If
	
	
	
	'Environment.Value("ZIP") = "91770-1111"
	Call func_EnterValueInTeField("BIDSC001_AccountInformation","ZipCode",Environment.Value("ZIP"))
	Call func_SendKey("ENTER")
	intCorrectedAddrFieldID = TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("Corrected Address").GetROProperty("field id")
	intToBeCorrectedZIPField = intCorrectedAddrFieldID + 195
	strToBeCorrectedZIP = TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("field id:=" & intToBeCorrectedZIPField).GetROProperty("text")
	strToBeCorrectedZIP = Left(strToBeCorrectedZIP,5) & "-" & Right(strToBeCorrectedZIP,4)
	
	Call func_SendKey("ENTER")
	Call func_SendKey("F12")
	If GetAndVerifyTeFieldValue("BIDSC001_AccountInformation","ZipCode",strToBeCorrectedZIP) Then
		Call func_reportStatus("Pass", "Verify ZIP Corrected", "The ZIP is corrected to '" & strToBeCorrectedZIP & "'")
		TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("ZipCode").Set ""
		Call func_SendKey("ENTER")
		If TeWindow("InfoProWindow").TeScreen("BIDSC001_AccountInformation").TeField("EnterPostalZIP").Exist(2) Then
			Call func_reportStatus("Pass", "Delete the ZIP", "ERROR : A postal/zip code is required. Please enter a value.")
			Call func_EnterValueInTeField("BIDSC001_AccountInformation","ZipCode",strOrigZIPCode)
			Call func_SendKey("ENTER")
			Call func_SendKey("F12")
			If GetAndVerifyTeFieldValue("BIDSC001_AccountInformation","ZipCode",strOrigZIPCode) Then
				Call func_reportStatus("Pass", "Replace the ZIP to its original value", "Replaced the ZIP to its original value " & strOrigZIPCode)
			Else
				Call func_reportStatus("Fail", "Replace the ZIP to its original value", "Not Replaced to its original value " & strOrigZIPCode)
			End If
		Else
			Call func_reportStatus("Fail", "Delete the ZIP", "ERROR 'A postal/zip code is required. Please enter a value' is not displayed")
		End If
	Else
		Call func_reportStatus("Fail", "Verify ZIP Corrected", "The ZIP is NOT corrected to '" & strToBeCorrectedZIP & "'")
	End If
End Function





