var keystone = require('keystone');
var Types = keystone.Field.Types;
console.log(keystone.Storage.Adapters)
var videoStorage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs: {
        path: keystone.expandPath("./public/uploads/files"),
        publicPath: "/public/uploads/files"
    }
})
/**
 * Video Model
 * ==========
 */

var Video= new keystone.List('Video', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Video.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'VideoCategory', many: true },
    file: {
        type: Types.File,
        storage: videoStorage
    }
});

Video.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Video.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Video.register();
