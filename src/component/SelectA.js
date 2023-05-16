import React from 'react';
  import {  Button, List, Avatar, Select } from "antd";
  
  
  const fontSizeArr = [
    { value: "United Kingdom"},
    { value: 10 },
    { value: 12 },
    { value: 13 },
    { value: 14 },
    { value: 16 },
    { value: 18 },
    { value: 20 },
    { value: 24 },
    { value: 28 },
    { value: 36 },
    { value: 48 },
    { value: 72 },
    { value: 144 },
    { value: 288 }
  ]
  
  class SelectA extends React.Component {
  
    state = {
      newValue: [],
      record: [],
    }
  
    onChangeSelect = (value, index) => {
      const { record } = this.state;
      console.log('===============点击的value', value)
      record[index] = value || '';
      console.log('===============record', record,record.length,typeof record[0],record[0]);
      this.setState({ record });
    }
  
    onSearchSelect = (value, index) => {
      const { newValue } = this.state;
      if (!!value) {
        newValue[index] = value || '';
        this.setState({ newValue });
      }
    }
  
    onBlurSelect = (index) => {
      const { newValue } = this.state;
      const value = newValue[index];
      console.log('===============输入的value', value)
      if (!!value) {
        this.onChangeSelect(value, index);
        delete newValue[index]; // 在onBlur后将对应的key删除，防止当从下拉框中选择后再次触发onBlur时经过此处恢复成原来的值
      }
    }
  
  
  
  
    render() {
      return (
        <div>
          <Select
            allowClear
            showSearch
            placeholder="请选择"
            onChange={(e) => this.onChangeSelect(e, '0')}
            onSearch={value => this.onSearchSelect(value, '0')}
            onBlur={() => this.onBlurSelect('0')}
            //filterOption={this.onFilterOption}  
            style={{ width: 170 }}
            value={this.state.record[0] || "Country"}
            //mode="multiple"
          >
            {fontSizeArr.map((item, index, arr) => <option key={index} value={item['value']}> {item['value']} </option>)}
          </Select>
        </div>
      )
    }
  
  }
  
  export default SelectA;