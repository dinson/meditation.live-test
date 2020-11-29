'user strict'

const mongoose = require('mongoose')
// output log of errors
mongoose.set('debug', true);

// Collection schema
const userViewSchema = mongoose.Schema({
    ProductId: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    ViewDate: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    UserId: {
        type: mongoose.Schema.Types.String,
        required: true
    }
})

var UserView = mongoose.model('userView', userViewSchema)

/**
 * Get count of visits
 * @param {string} productId 
 * @param {date} fromDate 
 * @param {date} toDate 
 * @param {bool} countUnique | if 1, only count unique user visits
 */
exports.getVisitCount = function(productId, fromDate, toDate, countUnique = 0) {
    return new Promise((resolve, reject) => {
        // filter by date range and product
        let query = {
            ProductId: productId,
            ViewDate: {$gte : new Date(fromDate), $lte: new Date(toDate)}
        }
        // get docs
        if (countUnique == 1) {
            UserView.distinct('UserId', query, function (err, result) {
                    if (err) reject(err);
                    var count = result.length
                    resolve(count)
                })
        } else {
            // get count of total visits
            UserView
                .countDocuments(query)
                .exec((err, count) => {
                    if (err)
                        reject(err)
                
                    resolve(count)
                });
        }
    })
}

/**
 * Add visitor to log
 * @param {string} productId 
 * @param {date} date 
 * @param {string} userId
 */
exports.add = function(productId, date, userId) {
    // create log
    const log = new UserView({
        ProductId: productId,
        ViewDate: date,
        UserId: userId
    })

    return new Promise(async (resolve, reject) => {  
        await log.save().then((result) => {
                resolve(result)
            }).catch(function(err){
                reject(err)
            })
        })
}