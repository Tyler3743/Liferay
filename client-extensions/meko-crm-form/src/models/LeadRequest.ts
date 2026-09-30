export interface ILeadData {
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  courseId: string;
  expectedResult?: string;
  leadBirthday?: string;
  freeTime?: string;
  leadNote?: string;
}

// Lớp OOP chuyên đóng gói dữ liệu Form thành cấu trúc JSON chuẩn cho API
export class LeadRequest {
  public name: string;
  public email: string;
  public phone: string;
  public courseId: string;
  public birthday: string | null;
  public source: string;
  public note: string;

  constructor(data: ILeadData) {
    this.name = data.leadName;
    this.email = data.leadEmail;
    this.phone = data.leadPhone;
    this.courseId = data.courseId;
    this.birthday = data.leadBirthday ? new Date(data.leadBirthday).toISOString() : null;
    this.source = 'Web Form Landing';
    // Đóng gói các thông tin phụ vào chung trường note theo yêu cầu
    this.note = `Kỳ vọng: ${data.expectedResult || 'N/A'}. Rảnh: ${data.freeTime || 'N/A'}. Ghi chú: ${data.leadNote || 'Không'}`;
  }

  // Method trả về chuẩn JSON object để Service gửi đi
  public toJSON() {
    return {
      leadName: this.name,
      leadEmail: this.email,
      leadPhone: this.phone,
      courseId: this.courseId,
      leadBirthday: this.birthday,
      leadSource: this.source,
      note: this.note
    };
  }
}
