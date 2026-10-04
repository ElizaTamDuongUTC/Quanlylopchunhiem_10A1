import { Student, Criteria, EmulationLog } from '../types';

// Initial Seed Data for Class 10A1 (40 students across 4 groups) - THPT Xuân Giang
export const INITIAL_STUDENTS: Student[] = [
  { id: 'HS01', name: 'Nguyễn Văn An', group: 1, score: 100, role: 'Lớp trưởng', avatar: '👦', weeklyChange: 0 },
  { id: 'HS02', name: 'Trần Thị Bình', group: 1, score: 100, role: 'Tổ trưởng Tổ 1', avatar: '👧', weeklyChange: 0 },
  { id: 'HS03', name: 'Lê Hoàng Cường', group: 1, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS04', name: 'Phạm Thị Dung', group: 1, score: 100, role: '', avatar: '👧', weeklyChange: 0 },
  { id: 'HS05', name: 'Hoàng Văn Em', group: 1, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS06', name: 'Vũ Thị Phương', group: 1, score: 100, role: 'Đội cờ đỏ', avatar: '👧', weeklyChange: 0 },
  { id: 'HS07', name: 'Đỗ Minh Giang', group: 1, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS08', name: 'Bùi Thị Hoa', group: 1, score: 100, role: '', avatar: '👧', weeklyChange: 0 },
  { id: 'HS09', name: 'Ngô Văn Hùng', group: 1, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS10', name: 'Dương Thị Khánh', group: 1, score: 100, role: '', avatar: '👧', weeklyChange: 0 },

  { id: 'HS11', name: 'Trịnh Quốc Long', group: 2, score: 100, role: 'Tổ trưởng Tổ 2', avatar: '👦', weeklyChange: 0 },
  { id: 'HS12', name: 'Phan Thị Mai', group: 2, score: 100, role: 'Đội cờ đỏ', avatar: '👧', weeklyChange: 0 },
  { id: 'HS13', name: 'Đinh Văn Nam', group: 2, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS14', name: 'Lý Thị Ngọc', group: 2, score: 100, role: '', avatar: '👧', weeklyChange: 0 },
  { id: 'HS15', name: 'Bùi Văn Phong', group: 2, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS16', name: 'Vũ Thị Quỳnh', group: 2, score: 100, role: '', avatar: '👧', weeklyChange: 0 },
  { id: 'HS17', name: 'Đặng Văn Sơn', group: 2, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS18', name: 'Hồ Thị Tâm', group: 2, score: 100, role: '', avatar: '👧', weeklyChange: 0 },
  { id: 'HS19', name: 'Nguyễn Đình Uyên', group: 2, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS20', name: 'Trần Văn Việt', group: 2, score: 100, role: '', avatar: '👦', weeklyChange: 0 },

  { id: 'HS21', name: 'Cao Thị Xuyến', group: 3, score: 100, role: 'Tổ trưởng Tổ 3', avatar: '👧', weeklyChange: 0 },
  { id: 'HS22', name: 'Lương Văn Yến', group: 3, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS23', name: 'Mai Thị Ánh', group: 3, score: 100, role: '', avatar: '👧', weeklyChange: 0 },
  { id: 'HS24', name: 'Phạm Văn Bảo', group: 3, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS25', name: 'Đỗ Thị Châu', group: 3, score: 100, role: '', avatar: '👧', weeklyChange: 0 },
  { id: 'HS26', name: 'Hà Văn Đức', group: 3, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS27', name: 'Nguyễn Thị Hà', group: 3, score: 100, role: '', avatar: '👧', weeklyChange: 0 },
  { id: 'HS28', name: 'Trần Văn Khoa', group: 3, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS29', name: 'Lê Thị Lan', group: 3, score: 100, role: 'Đội cờ đỏ', avatar: '👧', weeklyChange: 0 },
  { id: 'HS30', name: 'Hoàng Văn Minh', group: 3, score: 100, role: '', avatar: '👦', weeklyChange: 0 },

  { id: 'HS31', name: 'Vũ Thị Nga', group: 4, score: 100, role: 'Tổ trưởng Tổ 4', avatar: '👧', weeklyChange: 0 },
  { id: 'HS32', name: 'Đinh Văn Phúc', group: 4, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS33', name: 'Bùi Thị Quyên', group: 4, score: 100, role: '', avatar: '👧', weeklyChange: 0 },
  { id: 'HS34', name: 'Ngô Văn Sang', group: 4, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS35', name: 'Dương Thị Thảo', group: 4, score: 100, role: '', avatar: '👧', weeklyChange: 0 },
  { id: 'HS36', name: 'Trịnh Văn Toàn', group: 4, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS37', name: 'Phan Thị Uyên', group: 4, score: 100, role: '', avatar: '👧', weeklyChange: 0 },
  { id: 'HS38', name: 'Lý Văn Vinh', group: 4, score: 100, role: '', avatar: '👦', weeklyChange: 0 },
  { id: 'HS39', name: 'Hồ Thị Xuân', group: 4, score: 100, role: 'Lớp phó', avatar: '👧', weeklyChange: 0 },
  { id: 'HS40', name: 'Đặng Văn Dương', group: 4, score: 100, role: '', avatar: '👦', weeklyChange: 0 }
];

export const INITIAL_CRITERIA: Criteria[] = [
  { id: 'TC01', name: 'Xung phong phát biểu xây dựng bài', type: 'bonus', points: 5 },
  { id: 'TC02', name: 'Nhặt được của rơi trả lại người mất', type: 'bonus', points: 10 },
  { id: 'TC03', name: 'Làm bài tập đầy đủ, chuẩn bị bài tốt', type: 'bonus', points: 5 },
  { id: 'TC04', name: 'Giúp đỡ bạn học tập tiến bộ', type: 'bonus', points: 8 },
  { id: 'TC05', name: 'Đạt điểm 10 bài kiểm tra miệng/15 phút', type: 'bonus', points: 10 },
  { id: 'TC06', name: 'Trực nhật lớp sạch sẽ, đúng giờ', type: 'bonus', points: 5 },
  
  { id: 'TC11', name: 'Đi học muộn', type: 'penalty', points: -5 },
  { id: 'TC12', name: 'Không thuộc bài / Không làm bài tập', type: 'penalty', points: -10 },
  { id: 'TC13', name: 'Không mặc đúng đồng phục / Đeo khăn quàng', type: 'penalty', points: -5 },
  { id: 'TC14', name: 'Nói chuyện riêng trong giờ học', type: 'penalty', points: -5 },
  { id: 'TC15', name: 'Xả rác trong lớp học / Sân trường', type: 'penalty', points: -10 },
  { id: 'TC16', name: 'Mang đồ chơi / Thiết bị điện tử đến lớp', type: 'penalty', points: -15 }
];

export const INITIAL_LOGS: EmulationLog[] = [
  {
    id: 'LOG-101',
    time: '26/09/2026 08:15',
    scorer: 'Trần Thị Bình (Cờ đỏ)',
    studentId: 'HS13',
    studentName: 'Đinh Văn Nam',
    criteriaId: 'TC11',
    criteriaName: 'Đi học muộn',
    pointsChange: -5,
    type: 'penalty'
  },
  {
    id: 'LOG-100',
    time: '26/09/2026 07:50',
    scorer: 'Nguyễn Văn An (Lớp trưởng)',
    studentId: 'HS11',
    studentName: 'Trịnh Quốc Long',
    criteriaId: 'TC01',
    criteriaName: 'Xung phong phát biểu xây dựng bài',
    pointsChange: 5,
    type: 'bonus'
  }
];

const STORAGE_KEYS = {
  STUDENTS: 'smart_emulation_students_v1',
  CRITERIA: 'smart_emulation_criteria_v1',
  LOGS: 'smart_emulation_logs_v1',
  GAS_URL: 'smart_emulation_gas_url_v1',
  CURRENT_WEEK: 'smart_emulation_current_week_v1'
};

export const GAS_CODE_TEMPLATE = `/**
 * GOOGLE APPS SCRIPT CHO SỔ TAY THI ĐUA LỚP 10A1 - THPT XUÂN GIANG
 * Hướng dẫn cài đặt:
 * 1. Tạo Google Sheets mới đặt tên: DU_LIEU_THI_DUA_10A1
 * 2. Tạo các Sheet: DANH_SACH_HOC_SINH, DANH_MUC_THI_DUA, LICH_SU_CHAM_DIEM, CAU_HINH
 * 3. Vào Tiện ích mở rộng (Extensions) > Apps Script, dán toàn bộ mã này vào.
 * 4. Nhấn Triển khai (Deploy) > Triển khai mới (New deployment) > Chọn Loại: Web app.
 * 5. Quyền truy cập: Bất kỳ ai (Anyone). Copy URL Web App dán vào phần Cài đặt của Web App.
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = e.parameter.action;
  
  if (action === 'getAllData') {
    return sendJSON({
      students: getDataFromSheet(ss, 'DANH_SACH_HOC_SINH'),
      criteria: getDataFromSheet(ss, 'DANH_MUC_THI_DUA'),
      logs: getDataFromSheet(ss, 'LICH_SU_CHAM_DIEM')
    });
  }
  
  return sendJSON({status: 'success', message: 'Smart Emulation API is running'});
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = data.action;
    
    if (action === 'saveAllData') {
      saveDataToSheet(ss, 'DANH_SACH_HOC_SINH', data.students, ['id', 'name', 'group', 'score', 'role', 'avatar', 'weeklyChange']);
      saveDataToSheet(ss, 'DANH_MUC_THI_DUA', data.criteria, ['id', 'name', 'type', 'points']);
      saveDataToSheet(ss, 'LICH_SU_CHAM_DIEM', data.logs, ['id', 'time', 'scorer', 'studentId', 'studentName', 'criteriaId', 'criteriaName', 'pointsChange', 'type']);
      return sendJSON({status: 'success', message: 'Đã đồng bộ thành công với Google Sheets'});
    }
    
    return sendJSON({status: 'error', message: 'Unknown action'});
  } catch(err) {
    return sendJSON({status: 'error', message: err.toString()});
  }
}

function getDataFromSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  var headers = rows[0];
  var result = [];
  for (var i = 1; i < rows.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = rows[i][j];
    }
    result.push(obj);
  }
  return result;
}

function saveDataToSheet(ss, sheetName, dataArray, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  sheet.clear();
  sheet.appendRow(headers);
  if (!dataArray || dataArray.length === 0) return;
  
  var rows = [];
  for (var i = 0; i < dataArray.length; i++) {
    var row = [];
    for (var j = 0; j < headers.length; j++) {
      row.push(dataArray[i][headers[j]] !== undefined ? dataArray[i][headers[j]] : '');
    }
    rows.push(row);
  }
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function sendJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export class SheetsService {
  getGasUrl(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEYS.GAS_URL) || '';
  }

  setGasUrl(url: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.GAS_URL, url.trim());
  }

  getStudents(): Student[] {
    if (typeof window === 'undefined') return INITIAL_STUDENTS;
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const resetDone = localStorage.getItem('smart_emulation_reset_100_v1');
    if (!raw || !resetDone) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      localStorage.setItem('smart_emulation_reset_100_v1', 'true');
      return INITIAL_STUDENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STUDENTS;
    }
  }

  saveStudents(students: Student[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    this.syncToGasIfNeeded();
  }

  getCriteria(): Criteria[] {
    if (typeof window === 'undefined') return INITIAL_CRITERIA;
    const raw = localStorage.getItem(STORAGE_KEYS.CRITERIA);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(INITIAL_CRITERIA));
      return INITIAL_CRITERIA;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CRITERIA;
    }
  }

  saveCriteria(criteria: Criteria[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(criteria));
    this.syncToGasIfNeeded();
  }

  getLogs(): EmulationLog[] {
    if (typeof window === 'undefined') return INITIAL_LOGS;
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_LOGS;
    }
  }

  saveLogs(logs: EmulationLog[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    this.syncToGasIfNeeded();
  }

  getCurrentWeek(): number {
    if (typeof window === 'undefined') return 6;
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_WEEK);
    return raw ? parseInt(raw, 10) : 6;
  }

  setCurrentWeek(week: number) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_WEEK, week.toString());
  }

  // Sync to GAS if URL is provided
  private async syncToGasIfNeeded() {
    const url = this.getGasUrl();
    if (!url) return;
    try {
      const payload = {
        action: 'saveAllData',
        students: this.getStudents(),
        criteria: this.getCriteria(),
        logs: this.getLogs()
      };
      // Send async POST
      fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch {
      // ignore network errors
    }
  }

  async fetchFromGas(): Promise<{ success: boolean; message: string }> {
    const url = this.getGasUrl();
    if (!url) {
      return { success: false, message: 'Chưa cấu hình URL Google Apps Script.' };
    }
    try {
      const res = await fetch(`${url}?action=getAllData`, { method: 'GET' });
      const data = await res.json();
      if (data && data.students && data.criteria) {
        if (data.students.length > 0) {
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
        }
        if (data.criteria.length > 0) {
          localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(data.criteria));
        }
        if (data.logs && data.logs.length > 0) {
          localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(data.logs));
        }
        return { success: true, message: 'Đồng bộ dữ liệu từ Google Sheets thành công!' };
      }
      return { success: false, message: 'Dữ liệu trả về từ Google Sheets không hợp lệ.' };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      return { success: false, message: `Lỗi kết nối Google Sheets: ${errMsg}` };
    }
  }
}

export const sheetsService = new SheetsService();
