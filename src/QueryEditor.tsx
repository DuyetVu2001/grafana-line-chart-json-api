import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import {
  InlineField,
  Input,
  // LegacyForms
} from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

// const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, queryText: event.target.value });

    // executes the query
    onRunQuery();
  };

  onConstantChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, constant: parseFloat(event.target.value) });
    // executes the query
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const {
      queryText,
      // constant
    } = query;

    return (
      <div className="gf-form" style={{ width: '100%' }}>
        {/* <FormField
          width={4}
          value={constant}
          onChange={this.onConstantChange}
          label="Constant"
          type="number"
          step="0.1"
        /> */}

        <InlineField label="URL" grow={true}>
          <Input value={queryText || ''} onChange={this.onQueryTextChange} placeholder="line-chart data url" />
        </InlineField>
      </div>
    );
  }
}
