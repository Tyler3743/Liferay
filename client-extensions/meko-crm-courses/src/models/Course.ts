export interface ICourseData {
  id: string;
  code: string;
  name: string;
  type: string;
  subtitle: string;
  fee: number;
  duration: string;
  schedule: string;
  teacher: string;
  status: 'ACTIVE' | 'UPCOMING' | 'CLOSED';
  openClasses: number;
  isFull: boolean;
  color: 'blue' | 'yellow' | 'green' | 'gray';
}

export class Course {
  public id: string;
  public code: string;
  public name: string;
  public type: string;
  public subtitle: string;
  public fee: number;
  public duration: string;
  public schedule: string;
  public teacher: string;
  public status: string;
  public openClasses: number;
  public isFull: boolean;
  public color: string;

  constructor(data: ICourseData) {
    this.id = data.id;
    this.code = data.code;
    this.name = data.name;
    this.type = data.type;
    this.subtitle = data.subtitle;
    this.fee = data.fee;
    this.duration = data.duration;
    this.schedule = data.schedule;
    this.teacher = data.teacher;
    this.status = data.status;
    this.openClasses = data.openClasses;
    this.isFull = data.isFull;
    this.color = data.color;
  }

  public getFormattedFee(): string {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(this.fee);
  }

  public getStatusLabel(): string {
    switch (this.status) {
      case 'ACTIVE': return 'ĐANG ÁP DỤNG';
      case 'UPCOMING': return 'SẮP MỞ';
      case 'CLOSED': return 'NGỪNG NHẬN';
      default: return 'KHÔNG XÁC ĐỊNH';
    }
  }
}
