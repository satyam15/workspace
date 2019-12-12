
const fs=require('fs')
const files=[]
const subdir=[]
const files2=[]
const subdir2=[]
module.exports=function getFiles(dir){
    //files_0 = [];
    var file = fs.readdirSync(dir);
    for (var i in file){
        var name = dir + '/' + file[i];
        if (fs.statSync(name).isDirectory()){
            subdir.push(name)
            subdir2.push(file[i])
            getFiles(name);
        } else {
            files.push(name);
            files2.push(file[i])
        }
    }
    return {files,subdir,files2,subdir2}
}
