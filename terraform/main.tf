terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
    region = "us-east-1"
}

resource "aws_instance" "http_server" {
  ami = "ami-066784287e358dad1"
  key_name = "default-ec2"
  instance_type = "t2.micro"
  vpc_security_group_ids = [aws_security_group.http_server_sg.id]
  subnet_id = data.aws_subnets.default_subnets.ids[0]
  connection {
    type = "ssh"
    host = self.public_ip
    user = "ec2-user"
    private_key = file(var.aws_key_pair)
  }
}

resource "aws_s3_bucket" "my_s3_bucket" {
  bucket = "s3-bucket-final-project-logs-antoniszczekot-2"
}

variable "aws_key_pair" {
    default = "~/aws/aws_keys/default-ec2.pem"  
}