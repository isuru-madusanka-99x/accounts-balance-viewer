import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../shared/services/upload.service';

interface UploadResult {
  fileName: string;
  success: boolean;
  message: string;
  date: Date;
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  selectedFiles: File[] = [];
  isDragOver = false;
  isUploading = false;
  uploadResults: UploadResult[] = [];
  uploadHistory: UploadResult[] = [];
  
  // Upload progress tracking
  currentUploadIndex = 0;
  totalFiles = 0;
  currentFileName = '';
  uploadProgress = 0;

  constructor(private uploadService: UploadService) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = Array.from(event.dataTransfer?.files || []);
    this.addFiles(files);
  }

  onFileSelect(event: any): void {
    const files = Array.from(event.target.files || []) as File[];
    this.addFiles(files);
    // Clear the input
    event.target.value = '';
  }

  addFiles(files: File[]): void {
    const validFiles = files.filter(file => {
      const validTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      return validTypes.includes(file.type) || file.name.endsWith('.csv');
    });
    
    // Filter out duplicates
    const newFiles = validFiles.filter(file => 
      !this.selectedFiles.some(existing => existing.name === file.name)
    );
    
    this.selectedFiles = [...this.selectedFiles, ...newFiles];
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async uploadFiles(): Promise<void> {
    if (this.selectedFiles.length === 0) return;
    
    this.isUploading = true;
    this.uploadResults = [];
    this.totalFiles = this.selectedFiles.length;
    this.currentUploadIndex = 0;
    this.uploadProgress = 0;
    
    // Upload files one by one
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      this.currentFileName = file.name;
      this.currentUploadIndex = i;
      this.uploadProgress = (i / this.totalFiles) * 100;
      
      try {
        const response = await this.uploadService.uploadBalanceFile(file).toPromise();
        
        const result: UploadResult = {
          fileName: file.name,
          success: response?.success || false,
          message: response?.message || 'Upload completed successfully',
          date: new Date()
        };
        
        this.uploadResults.push(result);
        this.uploadHistory.unshift(result);
        
      } catch (error: any) {
        const result: UploadResult = {
          fileName: file.name,
          success: false,
          message: error?.error?.message || error?.message || 'Upload failed',
          date: new Date()
        };
        
        this.uploadResults.push(result);
        this.uploadHistory.unshift(result);
      }
    }
    
    // Complete progress
    this.uploadProgress = 100;
    
    // Clean up
    setTimeout(() => {
      this.isUploading = false;
      this.selectedFiles = [];
      this.currentFileName = '';
      this.currentUploadIndex = 0;
      this.uploadProgress = 0;
    }, 1000);
  }

  clearResults(): void {
    this.uploadResults = [];
  }
}