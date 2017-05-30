RepositoriesCollection.Add Environment.Value("RootPath") & "ObjectRepository\InforProOR.tsr"

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
strChargeCode = "ADD"
Select Case UCase(Environment.Value("Purpose"))
	Case "ADDRATE"				
'		strChargeCode = "ADD"
		strRate = "        20.00"		
		wait(2)
		intChgCodeFieldID = func_SearchItemInGrid(strChargeCode,0)
		If intChgCodeFieldID>0 Then
			TeWindow("InfoProWindow").TeScreen("BIDSC002_CONTAINER RATE INFORMATION").TeField("field id:=" & intChgCodeFieldID).SetCursorPos
			Call func_SendKey("BACKTAB")
			wait(1)
			Call func_SendKey("D")
			Call func_SendKey("ENTER") 
			wait(2)
			Call func_SendKey("F24") 
			wait(2)	
		End If
		
		arrDate = Split(Date,"/")
		arrDate(0) = func_SetToMaxFieldLength(arrDate(0),2)
		arrDate(1) = func_SetToMaxFieldLength(arrDate(1),2)
		arrDate(2) = Right(arrDate(2),2)
		strDate = arrDate(0) & arrDate(1) & arrDate(2)
		Call func_SendKey("F6")
		wait(2)
		If TeWindow("InfoProWindow").TeScreen("BIDSC002_CONTAINER RATE INFORMATION").TeField("RateMaintenanceWindow").Exist(2)=False Then
			Call func_reportStatus("Fail","Verify 'Rate Maintenance' Window","'Rate Maintenance' Window is NOT displayed")
			Call func_SetReturnCodeToZero()
		End If
		TeWindow("InfoProWindow").TeScreen("BIDSC002_CONTAINER RATE INFORMATION").TeField("AddDate").Set strDate
		Call func_SendKey("ENTER")
		wait(2)
		
		'Call func_SelectInputByHelp_OnScreen("BIDSC002_CONTAINER RATE INFORMATION","RateMaintenanceChargeCode",642)
		Call func_EnterValueInTeField("BIDSC002_CONTAINER RATE INFORMATION","RateMaintenanceChargeCode",strChargeCode)
		Call func_SendKey("ENTER")
		wait(1)
		Call func_SelectInputByHelp_OnScreen("BIDSC002_CONTAINER RATE INFORMATION","ChTp",642)
		Call func_SelectInputByHelp_OnScreen("BIDSC002_CONTAINER RATE INFORMATION","ChMt",642)
		Call func_SelectInputByHelp_OnScreen("BIDSC002_CONTAINER RATE INFORMATION","TxAp",642)
		
		Call func_EnterValueInTeField("BIDSC002_CONTAINER RATE INFORMATION","Rate",strRate)
		Call func_SendKey("ENTER")
		wait(2)
		Call func_SendKey("ENTER")
		wait(2)
		
		If TeWindow("InfoProWindow").TeScreen("BIDSC002_CONTAINER RATE INFORMATION").TeField("SalesTransactionWindow").Exist(2) Then
			Call func_SelectInputByHelp_OnScreen("BIDSC002_CONTAINER RATE INFORMATION","TransactionCodeReason",483)
			Call func_SelectInputByHelp_OnScreen("BIDSC002_CONTAINER RATE INFORMATION","CompetitorCode",642)
			Call func_SelectInputByHelp_OnScreen("BIDSC002_CONTAINER RATE INFORMATION","LeadSource",642)
			Call func_SendKey("ENTER")
			wait(2)
		End If
		
		intChgCodeFieldID = func_SearchItemInGrid(strChargeCode,0)
		If intChgCodeFieldID>0 Then
			Call func_reportStatus("Pass","Verify Added Rate","The Rate with charge code " & strChargeCode & " is added successfully")
		Else
			Call func_reportStatus("Fail","Verify Added Rate","The Rate with charge code " & strChargeCode & " is NOT added successfully")
		End If
	Case "CHANGERATE"
		intChgCodeFieldID = func_SearchItemInGrid(strChargeCode,0)
		If intChgCodeFieldID>0 Then
			Call func_reportStatus("Pass","Verify Rate","The Rate with charge code " & strChargeCode & " is available")
		Else
			Call func_reportStatus("Fail","Verify Rate","The Rate with charge code " & strChargeCode & " is NOT available")
			Call func_SetReturnCodeToZero()	
		End If
		
		TeWindow("InfoProWindow").TeScreen("BIDSC002_CONTAINER RATE INFORMATION").TeField("field id:=" & intChgCodeFieldID).SetCursorPos
		Call func_SendKey("BACKTAB")
		wait(1)
		Call func_SendKey("C")
		wait(1)
		Call func_SendKey("ENTER")
		wait(2)
		If TeWindow("InfoProWindow").TeScreen("BIDSC002_CONTAINER RATE INFORMATION").TeField("RateMaintenanceWindow").Exist(2)=False Then
			Call func_reportStatus("Fail","Verify 'Rate Maintenance' Window","'Rate Maintenance' Window is NOT displayed")
			Call func_SetReturnCodeToZero()
		End If
		Call func_EnterValueInTeField("BIDSC002_CONTAINER RATE INFORMATION","TxAp","1")
		Call func_SendKey("ENTER")
		wait(2)
		If TeWindow("InfoProWindow").TeScreen("BIDSC002_CONTAINER RATE INFORMATION").TeField("SalesTransactionWindow").Exist(2) Then
			Call func_SelectInputByHelp_OnScreen("BIDSC002_CONTAINER RATE INFORMATION","TransactionCodeReason",483)
			Call func_SelectInputByHelp_OnScreen("BIDSC002_CONTAINER RATE INFORMATION","CompetitorCode",642)
			Call func_SelectInputByHelp_OnScreen("BIDSC002_CONTAINER RATE INFORMATION","LeadSource",642)
			Call func_SendKey("ENTER")
			wait(2)
		End If
		intTxApFieldID = intChgCodeFieldID + 44
		strChangedTxAp = TeWindow("InfoProWindow").TeScreen("BIDSC002_CONTAINER RATE INFORMATION").TeField("field id:=" & intTxApFieldID).Text
		If Trim(strChangedTxAp)="1" Then
			Call func_reportStatus("Pass","Verify Change 'Rate'","The Rate is changed to " & strChangedTxAp)
		Else
			Call func_reportStatus("Fail","Verify Change 'Rate'","The Rate is NOT changed to 1")
		End If
	Case "CLOSE"  'IN Complete
		intChgCodeFieldID = func_SearchItemInGrid(strChargeCode,0)
		If intChgCodeFieldID>0 Then
			Call func_reportStatus("Pass","Verify Rate","The Rate with charge code " & strChargeCode & " is available")
		Else
			Call func_reportStatus("Fail","Verify Rate","The Rate with charge code " & strChargeCode & " is NOT available")
			Call func_SetReturnCodeToZero()	
		End If
		
		TeWindow("InfoProWindow").TeScreen("BIDSC002_CONTAINER RATE INFORMATION").TeField("field id:=" & intChgCodeFieldID).SetCursorPos
		Call func_SendKey("BACKTAB")
		wait(1)
		Call func_SendKey("S")
		wait(1)
		Call func_SendKey("ENTER")
		wait(2)
	Case "DELETE"
		intChgCodeFieldID = func_SearchItemInGrid(strChargeCode,0)
		If intChgCodeFieldID>0 Then
			Call func_reportStatus("Pass","Verify Rate","The Rate with charge code " & strChargeCode & " is available")
		Else
			Call func_reportStatus("Fail","Verify Rate","The Rate with charge code " & strChargeCode & " is NOT available")
			Call func_SetReturnCodeToZero()	
		End If
		
		TeWindow("InfoProWindow").TeScreen("BIDSC002_CONTAINER RATE INFORMATION").TeField("field id:=" & intChgCodeFieldID).SetCursorPos
		Call func_SendKey("BACKTAB")
		wait(1)
		Call func_SendKey("D")
		wait(1)
		Call func_SendKey("ENTER")
		wait(2)
		Call func_SendKey("F24") 
		wait(2)	
		If intChgCodeFieldID>0 Then
			Call func_reportStatus("Fail","Delete Rate","The Rate with charge code " & strChargeCode & " is Deleted")
		Else
			Call func_reportStatus("Fail","Delete Rate","The Rate with charge code " & strChargeCode & " is NOT Deleted")
			Call func_SetReturnCodeToZero()	
		End If
End Select





