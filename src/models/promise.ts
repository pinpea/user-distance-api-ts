// interface Response {
//   data: object,
// //   headers: IncomingHttpHeaders
// }
 
// function performRequest(options: RequestOptions) {
//   return new Promise((resolve, reject) => {
//     request(
//       options,
//       function(response) {
//         const { statusCode, headers } = response;
//         if (statusCode >= 300) {
//           reject(
//             new Error(response.statusMessage)
//           )
//         }
//         const chunks = [];
//         response.on('data', (chunk) => {
//           chunks.push(chunk);
//         });
//         response.on('end', () => {
//           const data = Buffer.concat(chunks).toString();
//           const result: Response = {
//             data: JSON.parse(data),
//             headers,
//           };
//           resolve(result);
//         });
//       }
//     )
//       .end();
//   })
// }