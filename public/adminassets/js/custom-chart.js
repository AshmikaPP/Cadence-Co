// (function ($) {
//     "use strict";

//     /*Sale statistics Chart*/
//     if ($('#myChart').length) {
//         var ctx = document.getElementById('myChart').getContext('2d');
//         let orderData = document.getElementById('orderData').value
//         let order = JSON.parse(orderData)

//         let apr = 0;
        
//         order.forEach((order) => {
//             for(let i=0;i<order.product.length;i++){
//                 let orderMonth = order.date.substr(0,3)
//                 console.log('om:',orderMonth);

//                 let orderYear = order.date.substr(-4)
//                 if(order.status === "Delivered" && orderMonth==="Apr"){
//                     apr++;
//                 }
//             }
//         });
//         console.log('apr:',apr);
//         var chart = new Chart(ctx, {
//             // The type of chart we want to create
//             type: 'line',
            
//             // The data for our dataset
//             data: {
//                 labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//                 datasets: [{
//                         label: 'Sales',
//                         tension: 0.3,
//                         fill: true,
//                         backgroundColor: 'rgba(44, 120, 220, 0.2)',
//                         borderColor: 'rgba(44, 120, 220)',
//                         data: [0, 5, 0, 10, 2, 20, 25, 31, 25, 22, 20, 9]
//                     },
//                     // {
//                     //     label: 'Visitors',
//                     //     tension: 0.3,
//                     //     fill: true,
//                     //     backgroundColor: 'rgba(4, 209, 130, 0.2)',
//                     //     borderColor: 'rgb(4, 209, 130)',
//                     //     data: [40, 20, 17, 9, 23, 35, 39, 30, 34, 25, 27, 17]
//                     // },
//                     // {
//                     //     label: 'Products',
//                     //     tension: 0.3,
//                     //     fill: true,
//                     //     backgroundColor: 'rgba(380, 200, 230, 0.2)',
//                     //     borderColor: 'rgb(380, 200, 230)',
//                     //     data: [30, 10, 27, 19, 33, 15, 19, 20, 24, 15, 37, 6]
//                     // }

//                 ]
//             },
//             options: {
//                 plugins: {
//                 legend: {
//                     labels: {
//                     usePointStyle: true,
//                     },
//                 }
//                 }
//             }
//         });
//     } //End if

//     /*Sale statistics Chart*/
//     if ($('#myChart2').length) {
//         var ctx = document.getElementById("myChart2");
//         var myChart = new Chart(ctx, {
//             type: 'bar',
//             data: {
//             labels: ["900", "1200", "1400", "1600"],
//             datasets: [
//                 {
//                     label: "US",
//                     backgroundColor: "#5897fb",
//                     barThickness:10,
//                     data: [233,321,783,900]
//                 }, 
//                 {
//                     label: "Europe",
//                     backgroundColor: "#7bcf86",
//                     barThickness:10,
//                     data: [408,547,675,734]
//                 },
//                 {
//                     label: "Asian",
//                     backgroundColor: "#ff9076",
//                     barThickness:10,
//                     data: [208,447,575,634]
//                 },
//                 {
//                     label: "Africa",
//                     backgroundColor: "#d595e5",
//                     barThickness:10,
//                     data: [123,345,122,302]
//                 },
//             ]
//             },
//             options: {
//                 plugins: {
//                     legend: {
//                         labels: {
//                         usePointStyle: true,
//                         },
//                     }
//                 },
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
//     } //end if
    
// })(jQuery);