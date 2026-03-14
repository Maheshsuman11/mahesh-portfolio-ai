// ================================================================
// MAHESH MALI PLATFORM — Google Apps Script v2.0
//
// SETUP INSTRUCTIONS:
// 1. Google Sheets kholo → Extensions → Apps Script
// 2. Saara purana code delete karo, yeh paste karo
// 3. Line 22 mein apna SHEET_ID daalo
//    (Sheet URL mein milega: /spreadsheets/d/[SHEET_ID]/edit)
// 4. Save (Ctrl+S)
// 5. Deploy → New Deployment → Web App
//    Execute as: Me | Who has access: Anyone
// 6. Deployed URL copy karo → Admin Panel → Settings mein paste karo
// ================================================================

// ⚠️ APNA GOOGLE SHEET ID YAHAN DAALO
const SHEET_ID = '1ID-Bw81fYN1W3VqUgXaIbjl1RZB9JkyxEc2doSfMxrM';

function doPost(e) {
  try {
    const data   = JSON.parse(e.postData.contents);
    const action = data.action;
    if (action === 'signup')         return signup(data);
    if (action === 'login')          return loginCheck(data);
    if (action === 'checkMobile')    return checkMobileExists(data);
    if (action === 'updatePassword') return updatePassword(data);
    if (action === 'lead')           return saveLead(data);
    return respond({ success: false, error: 'Unknown action: ' + action });
  } catch (err) {
    return respond({ success: false, error: err.toString() });
  }
}

function signup(data) {
  if (!data.mobile || !data.name || !data.password)
    return respond({ success: false, error: 'Missing required fields' });
  const sheet = getSheet('Users');
  if (findRowByMobile(sheet, data.mobile) !== -1)
    return respond({ success: false, error: 'Mobile already registered' });
  sheet.appendRow([
    data.id || ('user-' + Date.now()),
    data.name, data.mobile, data.password, 'active',
    data.joinDate || new Date().toISOString(),
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  ]);
  return respond({ success: true, message: 'User registered' });
}

function loginCheck(data) {
  const sheet = getSheet('Users');
  const rows  = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const [id, name, mobile, password, status, joinDate] = rows[i];
    if (String(mobile).trim() === String(data.mobile).trim() &&
        String(password).trim() === String(data.password).trim()) {
      if (status === 'blocked')
        return respond({ success: false, error: 'Account blocked. Admin se contact karo.' });
      return respond({ success: true, user: { id, name, mobile: String(mobile), blocked: false, joinDate } });
    }
  }
  return respond({ success: false, error: 'Invalid mobile ya password' });
}

function checkMobileExists(data) {
  const sheet = getSheet('Users');
  return respond({ success: true, exists: findRowByMobile(sheet, data.mobile) !== -1 });
}

function updatePassword(data) {
  const sheet  = getSheet('Users');
  const rowIdx = findRowByMobile(sheet, data.mobile);
  if (rowIdx === -1) return respond({ success: false, error: 'User not found' });
  sheet.getRange(rowIdx, 4).setValue(data.newPassword);
  return respond({ success: true, message: 'Password updated' });
}

function saveLead(data) {
  const sheet = getSheet('Leads');
  sheet.appendRow([
    data.id || ('lead-' + Date.now()),
    data.name || '', data.phone || '', data.message || '',
    data.source || 'chatbot', 'pending',
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  ]);
  return respond({ success: true, message: 'Lead saved' });
}

function getSheet(name) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    const headers = name === 'Users'
      ? ['ID', 'Name', 'Mobile', 'Password', 'Status', 'Join Date', 'Created At']
      : ['ID', 'Name', 'Phone', 'Message', 'Source', 'Status', 'Created At'];
    const r = sheet.getRange(1, 1, 1, headers.length);
    r.setValues([headers]);
    r.setBackground('#0a1120').setFontColor('#00c8ff').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function findRowByMobile(sheet, mobile) {
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][2]).trim() === String(mobile).trim()) return i + 1;
  }
  return -1;
}

function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Yeh function Apps Script editor mein run karo test ke liye
function testSetup() {
  Logger.log('Users sheet: ' + getSheet('Users').getLastRow() + ' rows');
  Logger.log('Leads sheet: ' + getSheet('Leads').getLastRow() + ' rows');
  Logger.log('Test passed!');
}
