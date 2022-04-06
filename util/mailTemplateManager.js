/* eslint-disable max-len */
const templateList = {
    verificationEmail: {
        subject: "",
        text: "",
        html: `<table style="
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 300;
    line-height: 2em;
    font-size: 14px;
    vertical-align: top;
    Margin: 0 auto;
    padding: 10px 10px 30px;
    
">
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div  class="content">
                    <table style="min-heigth: 200px;text-align: center;border-radius: 6px;box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);" class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table style="text-align:center" width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            <h1 style="margin-top: 30px;
    margin-bottom: 25px;
    min-height: 32px;color: #3C4858;
    text-decoration: none;color: #3C4858;
    text-decoration: none;font-weight: 700;
    font-family: "Roboto Slab", "Times New Roman", serif;"><%title%></h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <%reason%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 15px" class="content-block">
                                            <%description%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 5px" class="content-block">
                                            <a href='<%link%>' ><button style="
    display: inline-block;
    line-height: 60px;
    background-color: #19bd0e;
    color: #fff;
    width: 100%;
    max-width: 280px;
    border-radius: 3px;
    text-decoration: none;
    border-color: #19BD0D;
    border: none;
    font-weight: bold;text-transform: uppercase;text-align: center;text-decoration: none;font-size: 16px;margin-bottom: 0px;"><%btn%></button></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            — <%the%> ${process.env.APP_NAME}
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div style="margin-top: 20px" class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block"><%follow%> <a href="${process.env.twitter}">${process.env.twitter_name}</a> <%on%> Twitter, <a href="${process.env.fb}">Facebook</a> <%and%> <a href="${process.env.instagram}">Instagram</a>.<a href="${process.env.BASE_URL}"><%home%></a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`
    },
    resetPasswordByLink: {
        subject: "",
        text: "",
        html: `<table style="
font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 300;
    line-height: 2em;
    font-size: 14px;
    vertical-align: top;
    Margin: 0 auto;
    padding: 10px 10px 30px;
">
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div  class="content">
                    <table style="min-heigth: 200px;text-align: center;border-radius: 6px;box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);" class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table style="text-align:center" width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            <h1 style="margin-top: 30px;
    margin-bottom: 25px;
    min-height: 32px;color: #3C4858;
    text-decoration: none;color: #3C4858;
    text-decoration: none;font-weight: 700;
    font-family: "Roboto Slab", "Times New Roman", serif;"><%title%></h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 15px" class="content-block">
                                            <%description%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 5px" class="content-block">
                                            <a href='<%link%>' ><button style="
    display: inline-block;
    line-height: 60px;
    background-color: #19bd0e;
    color: #fff;
    width: 100%;
    border-color: #19BD0D;
    max-width: 280px;
    border-radius: 3px;
    text-decoration: none;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    border:none;
    margin-bottom: 0px;
"><%btn%></button></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            — <%the%> ${process.env.APP_NAME}
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div style="margin-top: 20px" class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block">Follow <a href="${process.env.twitter}">${process.env.twitter_name}</a> on Twitter, <a href="${process.env.fb}">Facebook</a> and <a href="${process.env.instagram}">Instagram</a>.<a href="${process.env.BASE_URL}">Home</a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`
    },
    resetPasswordByCode: {
        subject: "",
        text: "",
        html: `<table style="
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 300;
    line-height: 2em;
    font-size: 14px;
    vertical-align: top;
    Margin: 0 auto;
    padding: 10px 10px 30px;
">
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div  class="content">
                    <table style="min-heigth: 200px;text-align: center;border-radius: 6px;box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);" class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table style="text-align: center" width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            <h1 style="margin-top: 30px;
    margin-bottom: 25px;
    min-height: 32px;color: #3C4858;
    text-decoration: none;color: #3C4858;
    text-decoration: none;font-weight: 700;
    font-family: "Roboto Slab", "Times New Roman", serif;"><%title%></h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 15px" class="content-block">
                                            <%description%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 5px" class="content-block">
                                            <button style="
    display: inline-block;
    line-height: 60px;
    border: none;
    background-color: #19bd0e;
    color: #fff;
    width: 100%;
    border-color: #19BD0D;
    max-width: 280px;
    border-radius: 3px;
    text-decoration: none;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    margin-bottom: 0px;
"><%code%></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td  class="content-block">
                                            — <%the%> ${process.env.APP_NAME}
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block">Follow <a href="${process.env.twitter}">${process.env.twitter_name}</a> on Twitter, <a href="${process.env.fb}">Facebook</a> and <a href="${process.env.instagram}">Instagram</a>.<a href="${process.env.BASE_URL}">Home</a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`
    },
    newUserMessage: {
        subject: "",
        text: "",
        html: `<table style="
font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 300;
    line-height: 2em;
    font-size: 14px;
    vertical-align: top;
    Margin: 0 auto;
    padding: 10px 10px 30px;
">
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div  class="content">
                    <table style="min-heigth: 200px;text-align: center;border-radius: 6px;box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);" class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table style="text-align: center" width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            <h1 style="margin-top: 30px;
    margin-bottom: 25px;
    min-height: 32px;color: #3C4858;
    text-decoration: none;color: #3C4858;
    text-decoration: none;font-weight: 700;
    font-family: "Roboto Slab", "Times New Roman", serif;"><%title%></h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 15px" class="content-block">
                                            <%description%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 5px">
                                            <a href="<%url%>"><img src="<%image%>"/><a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 5px" class="content-block">
                                            <a href='<%profil%>'><button style="
    display: inline-block;
    line-height: 60px;
    background-color: #19bd0e;
    color: #fff;
    border: none;
    width: 100%;
    max-width: 280px;
    border-color: #19BD0D;
    border-radius: 3px;
    text-decoration: none;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    margin-bottom: 0px;
"><%btn%></button>
                                            </a>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td class="content-block">
                                            — <%the%> ${process.env.APP_NAME}
                                        </td>
                                        
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div style="margin-top: 20px" class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block"><%follow%> <a href="${process.env.twitter}">${process.env.twitter_name}</a> <%on%> Twitter, <a href="${process.env.fb}">Facebook</a> <%and%> <a href="${process.env.instagram}">Instagram</a>.<a href="${process.env.BASE_URL}"><%home%></a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`
    },
    welcomeToNewUser: {
        subject: "",
        text: "",
        html: `<table style="
font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 300;
    line-height: 2em;
    font-size: 14px;
    vertical-align: top;
    Margin: 0 auto;
    padding: 10px 10px 30px;
">
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                    <table style="min-heigth: 200px;text-align: center;border-radius: 6px;box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);" class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table style="text-align:center" width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            <h1 style="margin-top: 30px;
    margin-bottom: 25px;
    min-height: 32px;color: #3C4858;
    text-decoration: none;color: #3C4858;
    text-decoration: none;font-weight: 700;
    font-family: "Roboto Slab", "Times New Roman", serif;"><%title%></h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 15px" class="content-block">
                                            <%description%>
                                        </td>
                                    </tr>
                                   
                                    <tr>
                                        <td class="content-block">
                                            — <%the%> ${process.env.APP_NAME}
                                        </td>
                                        
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div style="margin-top: 20px" class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block"><%follow%> <a href="${process.env.twitter}">${process.env.twitter_name}</a> <%on%> Twitter, <a href="${process.env.fb}">Facebook</a> <%and%> <a href="${process.env.instagram}">Instagram</a>.<a href="${process.env.BASE_URL}"><%home%></a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`
    },
    profilPictureChange: {
        subject: "",
        text: "",
        html: `<table style="
font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 300;
    line-height: 2em;
    font-size: 14px;
    vertical-align: top;
    Margin: 0 auto;
    padding: 10px 10px 30px;
">
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div  class="content">
                    <table style="min-heigth: 200px;text-align: center;border-radius: 6px;box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);" class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table style="text-align: center" width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            <h1 style="margin-top: 30px;
    margin-bottom: 25px;
    min-height: 32px;color: #3C4858;
    text-decoration: none;color: #3C4858;
    text-decoration: none;font-weight: 700;
    font-family: "Roboto Slab", "Times New Roman", serif;"><%title%></h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 15px" class="content-block">
                                            <%description%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 5px">
                                            <a href="<%url%>"><img src="<%image%>"/><a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 5px" class="content-block">
                                            <a href='<%profil%>'><button style="
    display: inline-block;
    line-height: 60px;
    background-color: #19bd0e;
    color: #fff;
    width: 100%;
    max-width: 280px;
    border-radius: 3px;
    text-decoration: none;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    border-color: #19BD0D;
    text-decoration: none;
    font-size: 16px;
    margin-bottom: 0px;
">Profil</button>
                                            </a>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td class="content-block">
                                            — <%the%> ${process.env.APP_NAME}
                                        </td>
                                        
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div style="margin-top: 20px" class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block">Follow <a href="${process.env.twitter}">${process.env.twitter_name}</a> on Twitter, <a href="${process.env.fb}">Facebook</a> and <a href="${process.env.instagram}">Instagram</a>.<a href="${process.env.BASE_URL}">Home</a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`
    },
    anonymeMessage: {
        subject: "<%userName%>",
        text: "",
        html: `
        <table style="
 font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 300;
    line-height: 2em;
    font-size: 14px;
    vertical-align: top;
    Margin: 0 auto;
    padding: 10px 10px 30px;
">
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                    <table style="min-heigth: 200px;text-align: center;border-radius: 6px;box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);" class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table style="text-align: center" width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            <h1 style="margin-top: 30px;
    margin-bottom: 25px;
    min-height: 32px;color: #3C4858;
    text-decoration: none;color: #3C4858;
    text-decoration: none;font-weight: 700;
    font-family: "Roboto Slab", "Times New Roman", serif;"><%title%></h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 15px" class="content-block">
                                            <%description%>
                                        </td>
                                    </tr>
            
                                    
                                    <tr>
                                        <td class="content-block">
                                            — <%the%> <%email%>
                                        </td>
                                        
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                   </div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`
    },
    activity: {
        subject: "",
        text: "",
        html: `<table style="
    font-family: Arial,sans-serif;
    font-size: 14px;
    vertical-align: top;
    Margin: 0 auto;
    padding: 10px 10px 30px;
">
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                    <table style="min-heigth: 200px;text-align: center;border-radius: 6px;box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);" class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table style="text-align: center" width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                           <a href="<%url%>"> <h1 style="margin-top: 30px;
    margin-bottom: 25px;
    min-height: 32px;color: #3C4858;
    text-decoration: none;color: #3C4858;
    text-decoration: none;font-weight: 700;
    font-family: "Roboto Slab", "Times New Roman", serif;"><%title%></h1> </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <%description%>
                                        </td>
                                    </tr>
            
                                    
                                    <tr>
                                        <td class="content-block">
                                            — <%the%> ${process.env.APP_NAME}
                                        </td>
                                        
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                   </div>
                   <div style="margin-top: 20px" class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block"><%follow%> <a href="${process.env.twitter}">${process.env.twitter_name}</a> <%on%> Twitter, <a href="${process.env.fb}">Facebook</a> <%and%> <a href="${process.env.instagram}">Instagram</a>. <a href="${process.env.BASE_URL}"><%home%></a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`
    }
};

module.exports.getTemplate = name => templateList[name];
