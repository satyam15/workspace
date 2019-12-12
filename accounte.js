const sgmail=require('@sendgrid/mail')
const sendgridAPIkey='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'
sgmail.setApiKey(sendgridAPIkey)
const gmailsender=(email,name)=>
{
  sgmail.send( {
    to: email,
    from: 'satyamsavita015@gmail.com',
    subject: 'welcome message',
    text: 'hello '+name+' you have been successfully registered to our site use enjoy and explore new things ',
   
  })
  //sgmail.send(msg)
}
module.exports={
    gmailsender:gmailsender
}