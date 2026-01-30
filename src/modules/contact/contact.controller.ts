import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post()
    @ApiOperation({ summary: 'Send a contact message' })
    @ApiResponse({ status: 200, description: 'Message sent successfully' })
    @HttpCode(200)
    async sendMessage(@Body() body: any) {
        return this.contactService.sendMessage(body);
    }
}
