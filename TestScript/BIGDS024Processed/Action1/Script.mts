Dim str_pageCountQuery
Dim int_rowCount, int_CSPOcount
Dim str_CSPONum, str_selection

Call func_setScreenProperty("BIGDS024Processed")

If (TEWindow("InfoProWindow").TEScreen("BIGDS024Processed").TEField("UnscheduledRequests").Exist(5)) Then
	Call func_reportStatus("PASS", "Unscheduled Request", "Unscheduled Request Screen (BIGDS024Processed) exists")
	
	TEWindow("InfoProWindow").TEScreen("BIGDS024Processed").TeField("URACCT").Set Environment.Value("TrimAccountNumber")
	Call func_SendKey("ENTER")
	
	str_pageCountQuery = "SELECT COUNT(*) as ROWCOUNT FROM CUFILE.BIPUR WHERE URACCT = 44889 AND URCOMP = 803 AND URSCHD <> ''"
	
	Call func_retrieveData(str_pageCountQuery, "PAGECOUNT")
	
	Call func_SendKey("F7")
	
	int_rowCount = DataTable.Getsheet("CSPONUMBER").GetRowCount
	For int_CSPOcount = 1 To int_rowCount
		DataTable.GetSheet("CSPONUMBER").SetCurrentRow int_CSPOcount
		str_CSPONum = DataTable("URURNO","CSPONUMBER")
		str_selection = UCase(Trim(DataTable("SELECTION","CSPONUMBER")))
	
		If (str_selection = "D") Then
			For int_pageCount = 1 To Environment.Value("BIGDS024PageCount")
				Call func_SendKey("PAGEDOWN")
				Wait(2)
				Call func_SendKey("F7")
				Wait(2)
			Next 'For int_pageCount = 1 To Environment.Value("BIGDS024PageCount")
		End If 'If (str_selection = "D") Then
	Next 'For int_CSPOcount = 1 To int_rowCount
Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Unscheduled Request", "Unscheduled Request Screen (BIGDS024Processed) does not exist")
End If 'If (TEWindow("InfoProWindow").TEScreen("BIGDS024Processed").TEField("UnscheduledRequest").Exist(5)) Then
