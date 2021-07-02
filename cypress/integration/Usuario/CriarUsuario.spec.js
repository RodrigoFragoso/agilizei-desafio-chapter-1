/// <reference types="cypress"/>
var faker = require('faker-br');
let email = faker.internet.email()
let firstName = faker.name.firstName()
let lastName = faker.name.lastName()
let password = faker.internet.password()
let company = faker.company.companyName()
let address1 = faker.address.streetName()
let address2 = faker.address.streetName()
let postCode = '00000'
let city = faker.address.city()
let phone = faker.phone.phoneNumber()
let alias = faker.lorem.word()

describe('Desafio do Chapter #1', () => {
    context('Validar a criação de novos usuários', () => {
        before(() => {
            cy.visit('/')
            cy.intercept('POST', '/index.php').as('verificaCadastro')
            cy.get('a[class^=login]')
                .should('contain.text', 'Sign').click();
            cy.url()
                .should('contain', 'my-account')
            cy.contains('Authentication')
            cy.get('input#email_create')
                .type(email)
            cy.get('button#SubmitCreate').click()
            cy.wait('@verificaCadastro')
                .then((response) =>{
                    expect(response.response.statusCode).to.eq(200)
                })
        })

        it('Criando um novo usuário', () => {
            cy.url()
                .should('contain', 'account-creation')
            cy.contains('Your personal information')
            cy.get('div#uniform-id_gender2').should('be.visible').click()
            cy.get('input#customer_firstname').type(firstName)
            cy.get('input#customer_lastname').type(lastName)
            cy.get('input#email').should('contain.value', email)
            cy.get('input#passwd').type(password)
            cy.get('select#days').select('23')
            cy.get('select#months').select('January')
            cy.get('select#years').select('1989')
            cy.get('input#newsletter').check()
            cy.contains('Your address')
            cy.get('input#firstname').should('contain.value', firstName)
            cy.get('input#lastname').should('contain.value', lastName)
            cy.get('input#company').type(company)
            cy.get('input#address1').type(address1)
            cy.get('input#address2').type(address2)
            cy.get('input#city').type(city)
            cy.get('select#id_state').select('Colorado')
            cy.get('input#postcode').type(postCode)
            cy.get('textarea#other').type('Agilizei - Desafio do Chapter #1')
            cy.get('input#phone').type(phone)
            cy.get('input#phone_mobile').type(phone)
            cy.get('input#alias').clear().type(alias)
            cy.get('button#submitAccount').click()
            cy.url()
                .should('contain', 'controller=my-account')
            cy.contains('Welcome to your account.')
        });
    });

    context('Caminhos infelizes', () => {
        beforeEach(() => {
            cy.visit('/')
            cy.intercept('POST', '**/index.php').as('verificaCadastro')
            cy.get('a[class^=login]')
                .should('contain.text', 'Sign').click();
            cy.url()
                .should('contain', 'my-account')
            cy.contains('Authentication')
        })

        afterEach(() => {
            cy.wait('@verificaCadastro')
            .then((response) =>{
                expect(response.response.statusCode).to.eq(200)
            })
        })
        
        it('Tentar criar um usuário com e-mail já cadastrado', () => {
            cy.get('input#email_create')
                .type('teste@teste.com')
            cy.get('button#SubmitCreate').click()
            cy.get('div#create_account_error')
                .should('contain.text', 'email address has already been registered')
        });

        it('Tentar criar um usuário sem informar o e-mail', () => {
            cy.get('input#email_create')
                .type(' ')
            cy.get('button#SubmitCreate').click()
            cy.get('div#create_account_error')
                .should('contain.text', 'Invalid email address.')
        });

        it('Tentar criar um usuário com o e-mail invalido', () => {
            cy.get('input#email_create')
                .type('emailInvalido')
            cy.get('button#SubmitCreate').click()
            cy.get('div#create_account_error')
                .should('contain.text', 'Invalid email address.')
        });
    });
});