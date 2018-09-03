var keystone = require('keystone');

/**
 * VideoCategory Model
 * ==================
 */

var VideoCategory = new keystone.List('VideoCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

VideoCategory.add({
	name: { type: String, required: true },
});

VideoCategory.relationship({ ref: 'Video', path: 'videos', refPath: 'categories' });


VideoCategory.register();
