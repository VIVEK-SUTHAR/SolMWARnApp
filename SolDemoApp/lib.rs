use anchor_lang::prelude::*;
use std::mem::size_of;
declare_id!("BKpyosBjxPEweMLrnqzuKaVSXKAWSMcTXUnVfC59F2E3");

#[program]
mod sol_demo {
    use super::*;
    pub fn send_message(ctx: Context<SendMessage>, message: String) -> Result<()> {
        let message_acc = &mut ctx.accounts.message_acc;
        message_acc.data = message;
        message_acc.signer = ctx.accounts.signer.key();
        Ok(())
    }
    pub fn update_message(ctx: Context<UpdateMessage>, new_message: String) -> Result<()> {
        let message_acc = &mut ctx.accounts.message_acc;
        require!(
            message_acc.data != new_message,
            SolDemoErrors::SameMessageError,
        );
        message_acc.data = new_message;
        Ok(())
    }
    pub fn delete_message(ctx: Context<DeleteMessage>) -> Result<()> {
        let message_acc = &mut ctx.accounts.message_acc;
        require!(
            message_acc.signer.key() == ctx.accounts.signer.key(),
            SolDemoErrors::Unauthorized,
        );
        Ok(())
    }

}

#[derive(Accounts)]
pub struct SendMessage<'info> {
    #[account(
    init, 
    seeds = ["sender_".as_bytes(), signer.key().as_ref()],
    payer = signer,
    space = size_of::<Message>(),
    bump)]
    pub message_acc: Account<'info, Message>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateMessage<'info> {
    #[account(
    mut, 
    seeds=["sender_".as_bytes(), signer.key().as_ref()],
    bump
    )]
    pub message_acc: Account<'info, Message>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct DeleteMessage<'info> {
    #[account(
    mut,
    close=signer, 
    seeds=["sender_".as_bytes(), signer.key().as_ref()],
    bump
    )]
    pub message_acc: Account<'info, Message>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Message {
    data: String,
    signer: Pubkey,
}

#[error_code]
pub enum SolDemoErrors {
    #[msg("Unauthorized: Only the authorized deleter can delete the post.")]
    Unauthorized,
    #[msg("Message is same as previous message")]
    SameMessageError,
}
