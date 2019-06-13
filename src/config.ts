const BASE_URL = '/crciwms';
// const BASE_URL = 'http://192.168.0.112:8002/crciwms';
const VERSION = 'xxxxxxxx版本';
const MOCKJS_OPEN = true;

// 过滤掉的白名单，可以请求的时候不显示loading提示框
const whiteList = ["getImage", "downLoadContract","downLoadContractPDF"];

export { BASE_URL, MOCKJS_OPEN, whiteList, VERSION };
