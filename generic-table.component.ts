import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { GenericButtonComponent } from './generic-button/generic-button.component';
import {
  GenericTableDataSource,
  GenericTableItem,
} from './generic-table-datasource';

/**
 * Tabla generica
 *
 *
 *
 * @author Luis Felipe Fernandez Villota QVISION
 */
@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    GenericButtonComponent,
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTableComponent<T> implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<T>;
  @Input() dataSource!: GenericTableDataSource<T>;
  @Input() columns!: GenericTableItem[];
  @Input() idModel: string = 'id';
  @Input() editable: boolean = true;
  @Input() deletable: boolean = false;
  @Input() displayable: boolean = false;

  @Output() editAction: EventEmitter<any> = new EventEmitter();
  @Output() viewAction: EventEmitter<any> = new EventEmitter();
  @Output() deleteAction: EventEmitter<any> = new EventEmitter();

  private cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = [];

  ngOnInit() {
    this.displayedColumns = this.columns
      .filter((col) => !col.hidden)
      .map((col) => col.header);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource'] && this.table) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
      this.table.renderRows();
      this.cdr.detectChanges();
    }
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.cdr.detectChanges();
  }

  getCellValue(element: any, column: GenericTableItem): any {
    if (column.isParent) {
      const properties = column.field.split('.');
      let value = element;
      for (const prop of properties) {
        value = value ? value[prop] : '';
      }
      return value;
    }
    return element[column.field];
  }

  onEdit(id: any) {
    this.editAction.emit(id);
  }

  onView(id: any) {
    this.viewAction.emit(id);
  }
  onDelete(id: any) {
    this.deleteAction.emit(id);
  }
}
