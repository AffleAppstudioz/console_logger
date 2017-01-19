# Logger

Manage all your logs in file automatically with line numbers and file names

## Installation
```javascript
	npm install 
```

## Features
* Automatically log file managment 
* Full Control over terminal logs
* Log files path control
* Special Log function for direct use

## Quick Start

```javascript
  npm install console_logger 
```
Now require it in your sever file with self invoke function
```javascript
  require('console_logger')();
```
Now use `Log()` or `console.log()` in your project

## Logger(Optional Parameters)
Key | Value | Default | Description
------------ | ------------- | ------------- | -------------
console | true/false | true | Allow console.log to write logs in file
log | true/false | true | Allow Log to write logs in file  
showinterminal | true | true/false | show logs in terminal 
path | string | log | Path for creating logs with corresponding to Server File

##### Note 
If path parameter will not provided then a log folder will created and logs will genrate in it 

## Description of Logs 
Key | Value 
------------ | -------------
From |Console/Log (from which function log genrated) 
Time | HH:MM:SS | 
file | Filename | 
line | Line Number in File 
msg  | Message in Log/console

## Example 
```javascript
  Log("this is a example");
  or
  console.log("this is a example");
```
