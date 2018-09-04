var asyne = require("async"),
keystone = require("keystone");
var exec = require("child_process").exec
var FileData = keystone.list('FileUpload')

exports.list = (req,res) =>{
    FileData.model.find((err,items)=>{
        if(err) return res.apiError('database error',err)
        res.apiResponse({
            collections: items
        })
    })
}

exports.get = (req,res) =>{
    FileData.model.findById(req.params.id).exec((err,item)=>{
        if(err) return res.apiError('database error',err)
        if(!item) return res.apiError('not found')
        res.apiResponse({
            collection: item
        })
    })
}

exports.update = (req,res) =>{
    FileData.model.findById(req.params.id).exec((err,item)=>{
        if(err) return res.apiError('database error',err)
        if(!item) return res.apiError('not found')
        var data = (req.method=='POST')?req.body:req.query;
        console.log(req.body,req.query)
        item.getUpdateHandler(req).process(data,(err)=>{
            if(err) return res.apiError('create error',err)
            res.apiResponse({
                collection: item
            })
        })
    })
}

exports.create = (req,res) =>{
    var item = new FileData.model();
    var data = (req.method=='POST')?req.body:req.query;
    console.log(req.body,req.query)
    item.getUpdateHandler(req).process(req.files,(err)=>{
        if(err) return res.apiError('error',err)
        res.apiResponse({
            file_upload: item
        })
    })
}

exports.remove = (req,res) =>{
    var fileId = req.params.id
    FileData.model.findById(req.params.id).exec((err,item)=>{
        if(err) return res.apiError('database error',err)
        if(!item) return res.apiError('not found')
        item.remove((err)=>{
            if(err) return res.apiError('database error',err)
            exec(`rm public/uploads/files/${fileId}.*`,(err,stdout,stderr)=>{
                if(err) {
                    console.log('child process exited with error code '+err.code)
                    return
                }
                console.log(stdout)
            })
            return res.apiResponse({
                success:true
            })
        })
    })
}
