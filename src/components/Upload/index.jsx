
import React from 'react';
import {Upload, message, Button, Icon } from 'antd';


export default class UploadImage extends React.Component{
    state = {
        fileList : [],
    };
    
    render(){
        const {fileList}=this.state;
        const uploadProps = {
            name: 'file',
            action: '//jsonplaceholder.typicode.com/posts/',
            headers: {
                authorization: 'authorization-text',
            },
            disabled:false,
            showUploadList : true,
            onChange(info) {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
                return;
              }
              if (info.file.status === 'done') {
                message.success('${info.file.name} file uploaded successfully');
                return;
              } else if (info.file.status === 'error') {
                message.error('${info.file.name} file upload failed.');
                return;
              }
            },
            beforeUpload(file){
                const isImage = file.type ==='image/png'||'image/jpg';
                if(!isImage){
                    message.error('只能上传带.jpg、.png后缀的图片文件');
                }
                return isImage;
            }
    };
    
        const allowUpload = (
            <Button style={{width:150,marginTop:15,marginBottom:3}}>
                    <Icon type="upload" /> 上传Logo图片
            </Button>
        );
        
        const forbidUpload = (
            <Button style={{width:150,marginTop:15,marginBottom:3,background:'grey',color:'white'}} disabled={true}>已上传</Button>
        );

    return (
        <Upload {...uploadProps} fileList={fileList}>
            {fileList.length == 0 ?allowUpload : forbidUpload}
        </Upload>
    );
    }
}