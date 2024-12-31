const puppeteer = require('puppeteer');

(async () => {
  const username = '01531648';
  const password = '#5A2tkZP';

  if (!username || !password) {
    console.error('Erro: Credenciais não definidas no arquivo .env');
    process.exit(1);
  }

  try {
    const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    const page = await browser.newPage();

    console.log('Navegando para a página de login...');
    await page.goto('https://aluno.uninassau.edu.br');

    // Espera pelos campos de login
    await page.waitForSelector('#userNameInput', { visible: true, timeout: 60000 });
    await page.waitForSelector('#passwordInput', { visible: true, timeout: 60000 });

    // Insere as credenciais automaticamente
    console.log('Inserindo credenciais...');
    await page.type('#userNameInput', username);
    await page.type('#passwordInput', password);

    // Submete o formulário pressionando "Enter" no campo de senha
    console.log('Submetendo o login...');
    await page.keyboard.press('Enter');

    // Aguarda a navegação para verificar se o login foi bem-sucedido
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
    console.log('Login realizado com sucesso!');

    // Realiza as próximas ações, como clicar em links
    console.log('Procurando o link "Sala de Aula Virtual"...');
    const linkSelector = await page.waitForSelector('xpath///span[contains(text(), "Sala de Aula Virtual")]', { timeout: 60000 });

    if (linkSelector) {
      await linkSelector.click();
      console.log('Link "Sala de Aula Virtual" clicado com sucesso!');

      // Obter todas as abas abertas após o clique
      console.log('Aguardando nova aba...');
      const pages = await browser.pages();
      const newPage = pages[pages.length - 1]; // Obtém a aba mais recente aberta
      const temp = newPage.url();

      if (!newPage) {
        throw new Error('Nenhuma nova aba encontrada.');
      }

      // Espera pelo link "Cuidado Integral À Saúde do Adulto II"
      await newPage.waitForSelector('xpath///a[h4[contains(text(), "Cuidado Integral À Saúde do Adulto II")]]', { timeout: 60000 });

      const courseLink = await newPage.$('xpath///a[h4[contains(text(), "Cuidado Integral À Saúde do Adulto II")]]');
      if (courseLink) {
        await courseLink.click();
        console.log('Link do curso clicado com sucesso!');
      } else {
        console.log('Link do curso não encontrado.');
      }
    } else {
      console.log('Link "Sala de Aula Virtual" não encontrado.');
    }

    // Fecha o navegador após a execução
    await browser.close();
    console.log('Processo concluído!');
  } catch (error) {
    console.error('Erro durante o web scraping:', error);
  }
})();
