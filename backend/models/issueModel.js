const mongoose = require('mongoose');
const {schema} = mongoose;

const IssueSchema = new schema({
    title: { type: String, required: true },
    description: { type: String , required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    repository: { type: schema.Types.ObjectId, ref: 'Repository', required: true },
  });

const Issue = mongoose.model('Issue', IssueSchema);
export default Issue;