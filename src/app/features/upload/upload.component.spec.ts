import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UploadComponent } from './upload.component';
import { UploadService } from '../../shared/services/upload.service';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: any;
  let uploadService: jasmine.SpyObj<UploadService>;

  beforeEach(async () => {
    const uploadServiceSpy = jasmine.createSpyObj('UploadService', ['uploadBalanceFile']);

    await TestBed.configureTestingModule({
      imports: [UploadComponent],
      providers: [
        { provide: UploadService, useValue: uploadServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    uploadService = TestBed.inject(UploadService) as jasmine.SpyObj<UploadService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection', () => {
    const mockFile = new File(['test content'], 'test.csv', { type: 'text/csv' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    } as any;

    component.onFileSelect(mockEvent);

    expect(component.selectedFiles.length).toBe(1);
    expect(component.selectedFiles[0]).toBe(mockFile);
  });

  it('should remove file from selected files', () => {
    const mockFile = new File(['test content'], 'test.csv', { type: 'text/csv' });
    component.selectedFiles = [mockFile];

    component.removeFile(0);

    expect(component.selectedFiles.length).toBe(0);
  });

  it('should format file size correctly', () => {
    const sizeInBytes = 1024;
    const formattedSize = component.formatFileSize(sizeInBytes);
    expect(formattedSize).toBe('1 KB');
  });
  
  it('should clear results and reset state', () => {
    component.uploadResults = [
      { fileName: 'test.csv', success: true, message: 'Success', date: new Date() }
    ];

    component.clearResults();

    expect(component.uploadResults.length).toBe(0);
    expect(component.selectedFiles.length).toBe(0);
  });
});
