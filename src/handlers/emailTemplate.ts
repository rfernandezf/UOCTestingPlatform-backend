export function generateEmailTemplate(email: string, passcode: number)
{
    return `
<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title></title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">

    <style type="text/css">
      #outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }
    </style>
  </head>
  <body style="word-spacing:normal;background-color:#FFFFFF;">
      <div style="background-color:#FFFFFF;text-align: center;">
        <img style="width: 150px;" src="https://i.imgur.com/RXOKegN.jpeg">
        <div style="font-size:13px;line-height:1.5;color:#000000;">
          <p style="text-align: center;">
            <strong><span class="roboto" style="font-size: 25px;font-family: 'Roboto', serif;">UOC TESTING PLATFORM</span></strong>
          </p>
          <p>&nbsp;</p>
          <p style="text-align: center;">
            <span style="font-size: 17px; color: rgb(0, 0, 0);font-family: 'Roboto', serif;">Your login code for ${email} is:</span>
          </p>
          <p style="text-align: center;">
            <strong><span style="font-size: 25px;font-family: 'Roboto', serif;">${passcode}</span></strong>
          </p>
        </div>
      </div>
  </body>
</html>
`;
}