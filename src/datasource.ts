import {
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
  DataQueryRequest,
} from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';

import axios from 'axios';

/*eslint no-restricted-imports: ["error", "fs"]*/
import moment from 'moment';

import { MyQuery, MyDataSourceOptions } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  url: string | undefined;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);

    // this.url = instanceSettings.jsonData.path;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const fetchData = await Promise.all(
      options.targets.map((target) => axios.get(getTemplateSrv().replace(target.queryText || '', options.scopedVars)))
    );

    let all_query_data: any = {};
    fetchData.forEach((item) => {
      const query_data = item.data?.data || {};

      all_query_data = { ...all_query_data, ...query_data };
    });

    const data = Object.keys(all_query_data).map(
      (key) =>
        new MutableDataFrame({
          refId: key,
          fields: [
            {
              name: 'Time',
              values: all_query_data[key].map((item: any) => moment(item.time, 'X').format('YYYY-MM-DD HH:mm:ss')),
              type: FieldType.time,
            },
            { name: key, values: all_query_data[key].map((item: any) => +item.value), type: FieldType.number },
          ],
        })
    );

    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };

    // try {
    //   await axios.get(this.url || '');

    //   return {
    //     status: 'success',
    //     message: 'Success',
    //   };
    // } catch (error: any) {
    //   return {
    //     status: 'error',
    //     message: error.message,
    //   };
    // }
  }
}
