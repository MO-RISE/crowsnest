import * as React from "react";



import {
    List,
    Datagrid,
    TextField,
    BooleanField,
    BooleanInput,
    EmailField,
    Edit,
    Create,
    SimpleForm,
    TextInput,
    useRecordContext,
    PasswordInput,
    required,
    minLength,
    maxLength,
    regex,
    email,
} from 'react-admin';

const validateNames = [required(), minLength(2), maxLength(15)];
const validateEmail = [required(),email()];
const validatePath = regex(/([,]*\/[a-z0-9/]+)+/, 'Must be a valid path');
const validateTopic = regex(/([,]*\/[a-z0-9$*/]+)+/, 'Must be a valid path');
const validatePassword = [required(), minLength(5)] 
const validateNewPassword = [minLength(5)]

// Fix for null values
// Source: https://github.com/marmelab/react-admin/issues/7782#issuecomment-1163234000
/*
const NullableTextInput = ({format = (value) => value, parse = (input) => input, ...props}) => (
    <TextInput 
        {...props} 
        format={(value) => format(value || '')} 
        parse={(input) => parse(input === '' ? null : input)} 
    />
)

const NullablePasswordInput = ({format = (value) => value, parse = (input) => input, ...props}) => (
    <PasswordInput 
        {...props} 
        format={(value) => format(value || '')} 
        parse={(input) => parse(input === '' ? null : input)} 
    />
)
*/

const NullableTextInput = (props) => (
    <TextInput 
        {...props} 
        format={(value) => value === null ? '' : value} 
        parse={(input) => input === null ? '' : input} 
    />
)

const NullablePasswordInput = (props) => (
    <PasswordInput 
        {...props} 
        format={(value) => value === null ? '' : value} 
        parse={(input) => input === '' ? null : input} 
    />
)

const UserTitle = () => {
        const record = useRecordContext();
        return <span>User: {record ? `"${record.firstname} ${record.lastname}"` : ''}</span>;
    };

export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="username" />
            <TextField source="firstname" />
            <TextField source="lastname" />
            <EmailField source="email" />
            <BooleanField source="admin" />
            <TextField source="path_whitelist" />
            <TextField source="path_blacklist" />
            <TextField source="topic_whitelist" />
            <TextField source="topic_blacklist" />
        </Datagrid>
    </List>
  );

  export const UserEdit = () => (
    <Edit title={<UserTitle />}>
        <SimpleForm>
            <NullableTextInput disabled source="username" />
            <NullableTextInput source="firstname" validate={validateNames} />
            <NullableTextInput source="lastname" validate={validateNames}/>
            <NullableTextInput source="email" validate={validateEmail}/>  
            <NullablePasswordInput source="password" validate={validateNewPassword}/>
            <BooleanInput source="admin" />
            <NullableTextInput source="path_whitelist" validate={validatePath}/>
            <NullableTextInput source="path_blacklist" validate={validatePath}/>
            <NullableTextInput source="topic_whitelist" validate={validateTopic}/>
            <NullableTextInput source="topic_blacklist" validate={validateTopic}/>
        </SimpleForm>
    </Edit>
);


export const UserCreate = props => (
        <Create {...props}>
            <SimpleForm>
            <TextInput source="username" validate={validateNames} />
            <NullableTextInput source="firstname" validate={validateNames} />
            <NullableTextInput source="lastname" validate={validateNames}/>
            <NullableTextInput source="email" validate={validateEmail}/>  
            <NullablePasswordInput source="password" validate={validatePassword}/>
            <BooleanInput source="admin" />
            <NullableTextInput source="path_whitelist" validate={validatePath}/>
            <NullableTextInput source="path_blacklist" validate={validatePath}/>
            <NullableTextInput source="topic_whitelist" validate={validateTopic}/>
            <NullableTextInput source="topic_blacklist" validate={validateTopic}/>
            </SimpleForm>
        </Create>
    );