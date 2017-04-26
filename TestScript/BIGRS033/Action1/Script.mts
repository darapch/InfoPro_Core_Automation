Dim obj_routeProperty
Dim str_date, arr_date
Dim obj_WShell
Dim int_routeNumber, str_routeCount, arr_routeCount, int_routeCount, int_routePageCount, int_lastPageRouteCount, int_routePerPage
Dim int_pageCount, int_rowCount, int_routeFlag

Call func_setScreenProperty("BIGRS033")

If TEWindow("InfoProWindow").TEScreen("BIGRS033").TEField("CreateRoute").Exist(5) Then
	Call func_reportStatus("PASS", "Create Active Routes/Audits screen exists", "")
	
	If (Environment.Value("RoutingDate") = "") Then
		str_date = Date() - 1
	Else
		str_date = Environment.Value("RoutingDate")
	End If 'If (Environment.Value("RoutingDate") = "") Then
	
	Environment.Value("RoutingDate") = str_date
	
	arr_date = Split(str_date, "/")
	str_date = arr_date(0) & arr_date(1) & Right(arr_date(2), 2)
	
	If (TEWindow("InfoProWindow").TEScreen("BIGRS033").TEField("Date").Exist(2)) Then
		TEWindow("InfoProWindow").TEScreen("BIGRS033").TEField("Date").Set str_date
		Call func_SendKey("F10")
		Call func_reportStatus("PASS", "Date field exists", "Date: " & str_date & " entered")
		Wait(2)
		
		Set obj_WShell = CreateObject("wscript.shell")
		Set obj_routeProperty = TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("Route")
		int_routeFlag = 0
		
		int_routeNumber = Environment.Value("Route")
		
		'obj_routeProperty.SetTOProperty "text", int_routeNumber
		'obj_routeProperty.SetTOProperty "attached text", int_routeNumber&".*"
		
		str_routeCount = TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("RecordCount").Text
		arr_routeCount = Split(str_routeCount, " ")
		int_routeCount = CInt(Trim(arr_routeCount(2)))
		
		int_routePageCount = CInt(int_routeCount/16)
		
		If (int_routePageCount = 0) Then
			int_routePageCount = 1
		End If
		
		int_lastPageRouteCount = CInt(int_routeCount mod 16)
		
		For int_pageCount = 1 To int_routePageCount
		'For int_pageCount = 1 To 3
			If (int_lastPageRouteCount <> 0) AND (int_pageCount = int_routePageCount) Then
				'int_routePerPage = int_lastPageRouteCount + 1
				int_routePerPage = int_lastPageRouteCount
			Else
				int_routePerPage = 16
			End If 'If (int_lastPageRouteCount <> 0) AND (int_pageCount = int_routePageCount) Then
			
			For int_rowCount = 1 To int_routePerPage
			'For int_rowCount = 1 To 16
				If (int_rowCount = 1) Then
					obj_routeProperty.SetTOProperty "start row", 5
				End If 'If (int_rowCount = 1) Then
				
				If (TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("Route").Text = int_routeNumber) Then
					int_routeFlag = 1
					Call func_reportStatus("PASS", "Route " & int_routeNumber & " exists", "")
				Else
					Wait(1)
					TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("Route").SetCursorPos
					obj_WShell.Sendkeys "+{TAB}"
					obj_WShell.Sendkeys "N"
					Wait(1)
				End If 'If (TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("Route").Text = int_routeNumber) Then
				obj_routeProperty.SetTOProperty "start row", 5 + int_rowCount
			Next 'For int_rowCount = 1 To int_routePerPage
			
			If (TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("NextPage").Exist) Then
				obj_WShell.Sendkeys "{PGDN}"
			End If 'If (TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("NextPage").Exist) Then
		Next 'For int_pageCount = 1 To int_routePageCount
		
		If (int_routeFlag = 1) Then
			Call func_reportStatus("PASS", "Route " & int_routeNumber & " exists amd has been selected", "")
			Call func_SendKey("F10")
		Else
			Call func_reportFailureScreenshot()
			Call func_reportStatus("FAIL", "Route " & int_routeNumber & " was not found", "")
		End If 'If (int_routeFlag = 1) Then
		
	Else
		Call func_reportFailureScreenshot()
		Call func_reportStatus("FAIL", "Date field does not exists", "")
	End If 'If TEWindow("InfoProWindow").TEScreen("BIGRS033").TEField("CreateRoute").Exist(5) Then
	
	Set obj_WShell = Nothing
	Set obj_screenProperty = Nothing
	
Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Create Active Routes/Audits screen does not exists", "")
End If 'If TEWindow("InfoProWindow").TEScreen("BIGRS033").TEField("CreateRoute").Exist(5) Then

