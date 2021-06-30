import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) { }

  success(message: string, options: any) {
    this.toastr.success(message, 'Success!', options);
  }
  info(message: string, options: any) {
    this.toastr.info(message, 'Info!', options);
  }
  warning(message: string, options: any) {
    this.toastr.warning(message, 'Warning!', options);
  }
  error(message: string, options: any) {
    this.toastr.error(message, 'Error!', options);
  }
}
