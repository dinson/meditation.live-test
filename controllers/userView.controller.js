const UserView = require('../models/userView.model.js')

/**
 * Get count of visitors
 * @param {string} req | productId
 * @param {date} req | fromDate Date
 * @param {date} req | toDate Date
 * @param {bool} req | uniqueCountFlag bool | if 1, only count of unique visitors will be returned
 * @param {*} res 
 */
exports.getVisitCount = async function(req, res) {
    
    let productId = req.body.productId
    
    let fromDate = req.body.fromDate
    let toDate = req.body.toDate
    let uniqueCountFlag = req.body.uniqueCountFlag

    // get count
    UserView.getVisitCount(productId, fromDate, toDate, uniqueCountFlag)
        .then((count) => {
            
            res.status(200).send({
                'status': "success",
                'total_visits': count,
            })

        }).catch((err) => {
            
            res.status(404).send({
                'status': "error",
                "message": err
            })    

        })
}

/**
 * Record visit by user
 * @param {string} req productId
 * @param {string} req date
 * @param {string} req userId
 * @param {*} res 
 */
exports.addVisit = async function (req, res) {
    let productId = req.body.productId
    let date = req.body.date
    let userId = req.body.userId

    UserView.add(productId, date, userId).then((result) => {
        
        res.status(200).send({
            'status': "success",
            'message': "Visitor logged successfully!"
        })
    }).catch((err) => {
        res.status(500).send({
            'status': "error",
            'message': err
        })
    })
}