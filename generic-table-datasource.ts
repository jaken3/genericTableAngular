import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

/**
 * Interfaz que permite interactuar con la tabla
 *
 * header: titulo de la columna
 *
 * field: valor que tomara la columna, este lleva el nombre del modelo que llega
 *
 * isParent se usa cuando el dato a mapear es un objeto
 *
 * isAtribute se usa cuado el dato llega limpio en el field
 *
 * @example
 * dataSource: [{userName:Nombre_completo_usuario, id: 1}]
 * {header:'nombre', field:userName, isAtribute:true}
 *
 * @example
 * dataSource: [{user:{
 *  userName: nombre_completo
 * }, id: 1}]
 * {header:'nombre', field:user.userName, isParent:true}
 * @author Luis Felipe Fernandez QVISION
 */
export interface GenericTableItem {
  header: string;
  field: string;
  isAttribute?: boolean;
  isParent?: boolean;
  hidden?: boolean;
}

/**
 * Data source for the GenericTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class GenericTableDataSource<T> extends DataSource<T> {
  data: T[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(initialData: T[]) {
    super();
    this.data = initialData;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<T[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
        observableOf(this.data),
        this.paginator.page,
        this.sort.sortChange
      ).pipe(
        map(() => {
          return this.getPagedData(this.getSortedData([...this.data]));
        })
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: T[]): T[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: T[]): T[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        // case 'name':
        //   return compare(a.field, b.field, isAsc);
        // case 'id':
        //   return compare(+a.field, +b.field, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
