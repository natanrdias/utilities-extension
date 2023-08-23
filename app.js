const button = document.getElementById("importbtn");
const resultRL = document.getElementById("resultRL");
const resultMail = document.getElementById("resultMail");
const buttonCopyRL = document.getElementById("copyRL")
const buttonCopyMail = document.getElementById("copyMail")

button.addEventListener("click", async (event) => {
  event.preventDefault();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const data = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      const name = document.querySelector(
        "#merchant_details_content > div > div > div > div > table > tbody > tr:nth-child(18) > td:nth-child(2)"
      ).innerText;
      const email = document.querySelector(
        "#merchant_details_content > div > div > div > div > table > tbody > tr:nth-child(3) > td:nth-child(2) > input"
      ).value;
      return { name, email };
    },
  });

  // atribuimos o retorno a uma constante e usamos o replace com regex para detectar a primeira letra de cada palavra que está em lowercase e mudamos para upper
  const nameResult = data[0].result.name
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => {
      return letter.toUpperCase();
    });
  resultRL.innerText = nameResult;

  //atribuimos o retorno do e-mail a uma constante e fazemos a ocultação de caracteres.
  const emailResult = data[0].result.email.split("@");
  const userMail = emailResult[0].split("");
  const domainMail = emailResult[1];

  if(userMail.length < 6){
    for (let i = 0; i < userMail.length; i++) {
      userMail[i] = "*";
    }
  }else{
    for (let i = 1; i < userMail.length; i++) {
      userMail[i] = "*";
    }
  }
  const user = userMail.join('')
  const emailFinal = user + "@" + domainMail;
  resultMail.innerText = emailFinal;
});

buttonCopyRL.addEventListener('click', () =>{
  navigator.clipboard.writeText(resultRL.innerText);
})

buttonCopyMail.addEventListener('click', () =>{
  navigator.clipboard.writeText(resultMail.innerText);
})



