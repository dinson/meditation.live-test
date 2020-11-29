/**
 * User View JS functions
 * @description jquery functions to handle events in user view count page
 * @author Dinson David Kurian <dinson@slashbeyond.com>
 * @date 29 Nov 2020
 */
$(document).ready(function() {
    // global object to store from and to dates
    // state object will be updated everytime user change dates
    var state = {
        fromDate: '',
        toDate: ''
    }

    // Events
    $('body').on("change", "#date", setDate);
    $('body').on("change", "#fromDate", setFromDate)
    $('body').on("change", "#toDate", setToDate)
    // handle form submit
    $('body').on("click", '#submitBtn', submitFormHandler);

    function setDate()
    {
        let selectedDateRange = $('#date').val();
        if (selectedDateRange == "custom") {
            $('#customDateInputs').removeClass("d-none")
        } else {
            $('#customDateInputs').addClass("d-none")
        }

        var dateFrom = '';
        var dateTo = '';

        var d = new Date()
        let month;
        
        switch (selectedDateRange) {
            case "custom" :
                // show custom date inputs
                $('#customDateInputs').removeClass("d-none")
                state.fromDate = $('#fromDate').val()
                state.toDate = $('#toDate').val()
                break;
            
            case "today" :
                // hide custom date inputs
                $('#customDateInputs').addClass("d-none")
                // set state
                month = parseInt(d.getMonth()) + 1
                
                dateFrom = d.getFullYear() + '-' + month + '-' + d.getDate()
                dateTo = d.getFullYear() + '-' + month + '-' + d.getDate()
                
                state.fromDate = dateFrom
                state.toDate = dateTo
                
                break;
            
            case "week" :
                // hide custom date inputs
                $('#customDateInputs').addClass("d-none")
                // set state
                var first = d.getDate() - d.getDay(); // First day is the day of the month - the day of the week
                var last = first + 6; // last day is the first day + 6

                var firstDayOfWeek = new Date(d.setDate(first));
                var lastDayOfWeek = new Date(d.setDate(last));

                state.fromDate = firstDayOfWeek
                state.toDate = lastDayOfWeek
                
                break;

            case "month" :
                // hide custom date inputs
                $('#customDateInputs').addClass("d-none")

                month = parseInt(d.getMonth()) + 1
                // set state
                let prefix = d.getFullYear() + '-' + month + '-'
                
                var firstDayOfMonth = prefix + '01'
                var lastDayOfMonth = prefix + new Date(d.getFullYear(), month, 0).getDate();

                state.fromDate = firstDayOfMonth
                state.toDate = lastDayOfMonth

                break;

            default:
                break;
        }

    }

    function setFromDate()
    {
        state.fromDate = $('#fromDate').val()
    }

    function setToDate()
    {
        state.toDate = $('#toDate').val()
    }

    // handle form submission
    function submitFormHandler() {
        console.log("Submit button clicked!")
        let productId = $('#productId').val()
        let fromDate = state.fromDate
        let toDate = state.toDate

        if (productId.length < 1) {
            alert("Please provide a valid product ID")
            return
        }
        if (fromDate.length < 1) {
            alert("Please provide a valid from date")
            return
        }
        if (toDate.length < 1) {
            alert("Please provide a valid to date")
            return
        }

        // Fetch count of total visits
        fetchResults(productId, fromDate, toDate, 0)
            .then((count) => {
                // update view
                $('#showTotalVisitorCount').html(count)
                // Fetch count of unique visits
                fetchResults(productId, fromDate, toDate, 1)
                    .then(function(count) {
                        // update view
                        $('#showUniqueVisitorCount').html(count)
                    })
                    .catch((err) => {
                        alert(err)
                    })
            })
            .catch((err) => {
                alert(err)
            })
    }

    /**
     * handle ajax call
     * @param {string} productId 
     * @param {string} fromDate
     * @param {string} toDate 
     * @param {bool} uniqueCountFlag
     */
    function fetchResults(productId, fromDate, toDate, uniqueCountFlag)
    {
        let url = "http://localhost:3000/visit/count"

        var data = { 
            productId: productId, 
            fromDate: fromDate,
            toDate: toDate,
            uniqueCountFlag: uniqueCountFlag
        }

        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                url: url,
                data: data,
                success: (function( res ) {
                    resolve(res.total_visits)
                }),
                error: (function( err ) {
                    reject("Error!" + err.message)
                })
            })
        })
    }
})