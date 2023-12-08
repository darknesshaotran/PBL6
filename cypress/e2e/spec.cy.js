describe('Login page', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/login');
        cy.get('input[name=username]').type(username)

        // {enter} causes the form to submit
        cy.get('input[name=password]').type(`${password}{enter}`)
    
        // we should be redirected to /dashboard
        cy.url().should('include', 'http://localhost:3000/')
    
        // our auth cookie should be present
        cy.getCookie('token').should('exist')
    
        // UI should reflect this user being logged in
        cy.get('h1').should('contain', 'jane.lane')
    });
});
